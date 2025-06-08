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

  // Fetch sectors and subsectors for dropdowns
  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes] = await Promise.all([
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
      ]);
      setSectors(sectorRes.data?.data || []);
      setSubsectors(subsectorRes.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch sectors or subsectors:", error);
      setErrorMsg("Failed to load sectors or subsectors.");
    }
  };

  // Fetch assigned KPIs, optionally filtered by sector
  const fetchAssignedKPIs = async (sectorId) => {
    setLoading(true);
    try {
      const res = sectorId
        ? await axios.get(`${backendUrl}/api/assign/sector/${sectorId}`)
        : await axios.get(`${backendUrl}/api/assign/assigned-kpi`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      console.log("Fetched KPI Year Assignments:", data);

      setAssignedKPIs(data);

      // Initialize edit states for each assignment
      const initialEditStates = {};
      data.forEach((assignment) => {
        initialEditStates[assignment._id] = {
          startYear: assignment.startYear ?? "",
          endYear: assignment.endYear ?? "",
          editing: false,
        };
      });
      setEditStates(initialEditStates);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch assigned KPIs:", error);
      setErrorMsg("Failed to load assigned KPIs.");
      setAssignedKPIs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchAssignedKPIs(selectedSector);
  }, [selectedSector]);

  // Toggle editing mode for a specific KPI assignment
  const handleEditToggle = (assignmentId) => {
    setEditStates((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        editing: !prev[assignmentId].editing,
      },
    }));
  };

  // Handle changes in start/end year inputs, only allow digits
  const handleYearChange = (assignmentId, field, value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setEditStates((prev) => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          [field]: value,
        },
      }));
    }
  };

  // Save updated years to backend
  const handleSaveYears = async (assignmentId, kpiId, sectorId, subsectorId, deskId) => {
    const { startYear, endYear } = editStates[assignmentId];
    const startYearNum = Number(startYear);
    const endYearNum = Number(endYear);

    if (
      !startYear ||
      !endYear ||
      isNaN(startYearNum) ||
      isNaN(endYearNum) ||
      startYearNum > endYearNum
    ) {
      alert("Please enter valid start and end years. Start year must not be greater than end year.");
      return;
    }

    try {
      setSavingIds((prev) => new Set(prev).add(assignmentId));

      const res = await axios.post(`${backendUrl}/api/year/assign`, {
        assignmentId,
        kpiId,
        sectorId: sectorId?._id || sectorId,
        subsectorId: subsectorId?._id || subsectorId,
        deskId: deskId?._id || deskId,
        startYear: startYearNum,
        endYear: endYearNum,
      });

      const updated = res.data;

      // Update local state with updated assignment data
      setAssignedKPIs((prev) =>
        prev.map((a) => (a._id === assignmentId ? updated : a))
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

      alert("Years updated successfully!");
    } catch (error) {
      console.error("Failed to save year values:", error);
      alert("Failed to save year values.");
    } finally {
      setSavingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(assignmentId);
        return copy;
      });
    }
  };

  // Helper to get sector name from subsectorId
  const getSectorNameFromSubsector = (subsectorId) => {
    const subsector =
      typeof subsectorId === "object"
        ? subsectorId
        : subsectors.find((s) => s._id === subsectorId);

    const sectorId =
      typeof subsector?.sectorId === "object"
        ? subsector?.sectorId?._id
        : subsector?.sectorId;

    return sectors.find((s) => s._id === sectorId)?.sector_name || "-";
  };

  // Helper to get sector name from sectorId
  const getSectorNameFromSectorId = (sectorId) => {
    const sector =
      typeof sectorId === "object"
        ? sectorId
        : sectors.find((s) => s._id === sectorId);
    return sector?.sector_name || "-";
  };

  // Filter assigned KPIs based on search term
  const filteredAssignedKPIs = assignedKPIs.filter(({ kpiId }) => {
    const term = searchTerm.toLowerCase();
    return (
      kpiId?.kpi_name?.toLowerCase().includes(term) ||
      kpiId?.kra?.kra_name?.toLowerCase().includes(term) ||
      kpiId?.goal?.goal_desc?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Assigned KPI Year Management</h2>

      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <div className="mb-4 flex gap-4 items-center">
        <select
          className="border border-gray-300 rounded px-4 py-2"
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
          className="border border-gray-300 rounded px-4 py-2 flex-grow"
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

            {filteredAssignedKPIs.map(({ _id: assignmentId, sectorId, subsectorId, deskId, kpiId }) => {
              const editState = editStates[assignmentId] || {};
              const isEditing = editState.editing;
              const isSaving = savingIds.has(assignmentId);

              return (
                <tr key={assignmentId}>
                  <td className="border px-4 py-2">
                    {subsectorId
                      ? getSectorNameFromSubsector(subsectorId)
                      : getSectorNameFromSectorId(sectorId)}
                  </td>
                  <td className="border px-4 py-2">
                    {subsectorId?.subsector_name || "-"}
                  </td>
                  <td className="border px-4 py-2">{kpiId?.kra?.kra_name || "-"}</td>
                  <td className="border px-4 py-2">{kpiId?.kpi_name || "-"}</td>

                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editState.startYear}
                        onChange={(e) =>
                          handleYearChange(assignmentId, "startYear", e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1"
                        maxLength={4}
                      />
                    ) : (
                      kpiId?.startYear ?? "-"
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editState.endYear}
                        onChange={(e) =>
                          handleYearChange(assignmentId, "endYear", e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1"
                        maxLength={4}
                      />
                    ) : (
                      kpiId?.endYear ?? "-"
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() =>
                            handleSaveYears(
                              assignmentId,
                              kpiId?._id,
                              sectorId,
                              subsectorId,
                              deskId
                            )
                          }
                          disabled={isSaving}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => handleEditToggle(assignmentId)}
                          disabled={isSaving}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditToggle(assignmentId)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
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
