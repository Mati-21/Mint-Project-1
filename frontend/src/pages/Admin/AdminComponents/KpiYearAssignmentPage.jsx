import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

const KpiYearAssignmentPage = () => {
  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  const [assignedKPIs, setAssignedKPIs] = useState([]);
  const [editStates, setEditStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes] = await Promise.all([
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
      ]);
      setSectors(sectorRes.data?.data || []);
      setSubsectors(subsectorRes.data || []);
    } catch (error) {
      console.error("Failed to fetch sectors or subsectors:", error);
      setErrorMsg("Failed to load sectors or subsectors");
    }
  };

  // Fetch KPI assignments
  const fetchAssignedKPIs = async (sectorId) => {
    setLoading(true);
    try {
      let res;
      if (sectorId) {
        res = await axios.get(`${backendUrl}/api/assign/sector/${sectorId}`);
      } else {
        res = await axios.get(`${backendUrl}/api/assign/assigned-kpi`);
      }

      const data = Array.isArray(res.data) ? res.data : [];
      setAssignedKPIs(data);

      const initialEditStates = {};
      data.forEach((assignment) => {
        const kpi = assignment.kpiId;
        if (kpi) {
          initialEditStates[assignment._id] = {
            startYear: assignment.startYear ?? "",
            endYear: assignment.endYear ?? "",
            editing: false,
          };
        }
      });

      setEditStates(initialEditStates);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch assigned KPIs:", error);
      setAssignedKPIs([]);
      setErrorMsg("Failed to load assigned KPIs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAssignedKPIs();
  }, []);

  useEffect(() => {
    fetchAssignedKPIs(selectedSector);
  }, [selectedSector]);

  const handleEditToggle = (assignmentId) => {
    setEditStates((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        editing: !prev[assignmentId].editing,
      },
    }));
  };

  const handleYearChange = (assignmentId, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  const handleSaveYears = async (assignmentId, kpiId, sectorId, subsectorId, deskId) => {
    let { startYear, endYear } = editStates[assignmentId];
    if (!startYear || !endYear) {
      alert("Both start year and end year are required.");
      return;
    }

    // Convert to numbers here
    const startYearNum = Number(startYear);
    const endYearNum = Number(endYear);

    if (isNaN(startYearNum) || isNaN(endYearNum)) {
      alert("Start year and End year must be valid numbers.");
      return;
    }

    if (startYearNum > endYearNum) {
      alert("Start year cannot be greater than End year.");
      return;
    }

    try {
      setSavingIds((prev) => new Set(prev).add(assignmentId));

      const res = await axios.post(`${backendUrl}/api/year/assign`, {
        kpiId,
        sectorId,
        subsectorId,
        deskId,
        startYear: startYearNum,
        endYear: endYearNum,
      });

      const updatedAssignment = res.data;

      // Update assignedKPIs to reflect the new years (assuming backend returns full assignment)
      setAssignedKPIs((prev) =>
        prev.map((a) => (a._id === assignmentId ? updatedAssignment : a))
      );

      setEditStates((prev) => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          editing: false,
          startYear: startYearNum,
          endYear: endYearNum,
        },
      }));

      alert("Years assigned successfully!");
    } catch (error) {
      console.error("Failed to assign years:", error);
      alert("Failed to assign years. Please try again.");
    } finally {
      setSavingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(assignmentId);
        return copy;
      });
    }
  };

  const filteredAssignedKPIs = assignedKPIs
    .map((assignment) => ({
      assignmentId: assignment._id,
      sectorId: assignment.sectorId,
      subsectorId: assignment.subsectorId,
      deskId: assignment.deskId,
      kpi: assignment.kpiId,
    }))
    .filter(({ kpi }) => {
      const term = searchTerm.toLowerCase();
      return (
        kpi?.kpi_name?.toLowerCase().includes(term) ||
        kpi?.kra?.kra_name?.toLowerCase().includes(term) ||
        kpi?.goal?.goal_desc?.toLowerCase().includes(term)
      );
    });

  const getSectorNameFromSubsector = (subsectorId) => {
    if (!subsectorId) return "-";
    const subsectorObj =
      typeof subsectorId === "object"
        ? subsectorId
        : subsectors.find((sub) => sub._id === subsectorId);

    if (!subsectorObj) return "-";

    const sectorIdInSubsector =
      typeof subsectorObj.sectorId === "object"
        ? subsectorObj.sectorId._id
        : subsectorObj.sectorId;

    const sectorObj = sectors.find((sec) => sec._id === sectorIdInSubsector);
    return sectorObj?.sector_name || "-";
  };

  const getSectorNameFromSectorId = (sectorId) => {
    if (!sectorId) return "-";
    const sectorObj =
      typeof sectorId === "object"
        ? sectorId
        : sectors.find((sec) => sec._id === sectorId);
    return sectorObj?.sector_name || "-";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Assigned KPI Year Management</h2>

      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <div className="mb-4 flex items-center gap-4">
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option value="">All Sectors</option>
          {sectors.map((sector) => (
            <option key={sector._id} value={sector._id}>
              {sector.sector_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search assigned KPIs..."
          className="border border-gray-300 rounded-md px-4 py-2 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading assigned KPIs...</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Sector</th>
              <th className="border px-4 py-2">Subsector</th>
              <th className="border px-4 py-2">KRA</th>
              <th className="border px-4 py-2">KPI</th>
              <th className="border px-4 py-2">Start Year</th>
              <th className="border px-4 py-2">End Year</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignedKPIs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No assigned KPIs found.
                </td>
              </tr>
            )}

            {filteredAssignedKPIs.map(({ assignmentId, sectorId, subsectorId, deskId, kpi }) => {
              const editState = editStates[assignmentId] || {};
              const isEditing = editState.editing;
              const isSaving = savingIds.has(assignmentId);

              return (
                <tr key={`${assignmentId}-${kpi?.kpi_id}`}>
                  <td className="border px-4 py-2">
                    {subsectorId
                      ? getSectorNameFromSubsector(subsectorId)
                      : getSectorNameFromSectorId(sectorId)}
                  </td>
                  <td className="border px-4 py-2">
                    {subsectorId
                      ? typeof subsectorId === "object"
                        ? subsectorId.subsector_name || "-"
                        : subsectors.find((s) => s._id === subsectorId)?.subsector_name || "-"
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">{kpi?.kra?.kra_name || "-"}</td>
                  <td className="border px-4 py-2">{kpi?.kpi_name || "-"}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      disabled={!isEditing || isSaving}
                      value={editState.startYear || ""}
                      onChange={(e) =>
                        handleYearChange(assignmentId, "startYear", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      disabled={!isEditing || isSaving}
                      value={editState.endYear || ""}
                      onChange={(e) =>
                        handleYearChange(assignmentId, "endYear", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {!isEditing ? (
                      <button
                        onClick={() => handleEditToggle(assignmentId)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Edit years"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleSaveYears(assignmentId, kpi?.kpi_id, sectorId, subsectorId, deskId)
                        }
                        disabled={isSaving}
                        className={`px-3 py-1 rounded text-white ${
                          isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title="Save years"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KpiYearAssignmentPage;
