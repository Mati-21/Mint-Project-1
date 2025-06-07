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

<<<<<<< Updated upstream
  // Fetch dropdown data
=======
>>>>>>> Stashed changes
  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes] = await Promise.all([
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
      ]);
      setSectors(sectorRes.data?.data || []);
<<<<<<< Updated upstream
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
=======
      setSubsectors(subsectorRes.data?.data || []);
    } catch {
      setErrorMsg("Failed to load sectors or subsectors.");
    }
  };

  const fetchAssignedKPIs = async (sectorId) => {
    setLoading(true);
    try {
      const res = sectorId
        ? await axios.get(`${backendUrl}/api/assign/sector/${sectorId}`)
        : await axios.get(`${backendUrl}/api/assign/assigned-kpi`);

      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      // ✅ Debugging log for fetched KPI Year Assignments
      console.log("Fetched KPI Year Assignments:", data);

>>>>>>> Stashed changes
      setAssignedKPIs(data);

      const initialEditStates = {};
      data.forEach((assignment) => {
<<<<<<< Updated upstream
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
=======
        initialEditStates[assignment._id] = {
          startYear: assignment.startYear ?? "",
          endYear: assignment.endYear ?? "",
          editing: false,
        };
      });
      setEditStates(initialEditStates);
    } catch {
      setErrorMsg("Failed to load assigned KPIs.");
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
<<<<<<< Updated upstream
    fetchAssignedKPIs();
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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

  const handleSaveYears = async (assignmentId, kpiId, sectorId, subsectorId, deskId) => {
    const { startYear, endYear } = editStates[assignmentId];
    const startYearNum = Number(startYear);
    const endYearNum = Number(endYear);

    if (!startYear || !endYear || isNaN(startYearNum) || isNaN(endYearNum) || startYearNum > endYearNum) {
      alert("Please enter valid start and end years. Start year must not be greater than end year.");
>>>>>>> Stashed changes
      return;
    }

    try {
      setSavingIds((prev) => new Set(prev).add(assignmentId));

      const res = await axios.post(`${backendUrl}/api/year/assign`, {
<<<<<<< Updated upstream
        kpiId,
        sectorId,
        subsectorId,
        deskId,
=======
        assignmentId,
        kpiId,
        sectorId: sectorId?._id || sectorId,
        subsectorId: subsectorId?._id || subsectorId,
        deskId: deskId?._id || deskId,
>>>>>>> Stashed changes
        startYear: startYearNum,
        endYear: endYearNum,
      });

<<<<<<< Updated upstream
      const updatedAssignment = res.data;

      // Update assignedKPIs to reflect the new years (assuming backend returns full assignment)
      setAssignedKPIs((prev) =>
        prev.map((a) => (a._id === assignmentId ? updatedAssignment : a))
=======
      const updated = res.data;

      setAssignedKPIs((prev) =>
        prev.map((a) => (a._id === assignmentId ? updated : a))
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      alert("Years assigned successfully!");
    } catch (error) {
      console.error("Failed to assign years:", error);
      alert("Failed to assign years. Please try again.");
=======
      alert("Years updated successfully!");
    } catch {
      alert("Failed to save year values.");
>>>>>>> Stashed changes
    } finally {
      setSavingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(assignmentId);
        return copy;
      });
    }
  };

<<<<<<< Updated upstream
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

=======
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

  const getSectorNameFromSectorId = (sectorId) => {
    const sector =
      typeof sectorId === "object"
        ? sectorId
        : sectors.find((s) => s._id === sectorId);
    return sector?.sector_name || "-";
  };

  const filteredAssignedKPIs = assignedKPIs.filter(({ kpiId }) => {
    const term = searchTerm.toLowerCase();
    return (
      kpiId?.kpi_name?.toLowerCase().includes(term) ||
      kpiId?.kra?.kra_name?.toLowerCase().includes(term) ||
      kpiId?.goal?.goal_desc?.toLowerCase().includes(term)
    );
  });

>>>>>>> Stashed changes
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Assigned KPI Year Management</h2>

<<<<<<< Updated upstream
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <div className="mb-4 flex items-center gap-4">
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
=======
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <div className="mb-4 flex gap-4 items-center">
        <select
          className="border border-gray-300 rounded px-4 py-2"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          className="border border-gray-300 rounded-md px-4 py-2 flex-grow"
=======
          className="border border-gray-300 rounded px-4 py-2 flex-grow"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
            {filteredAssignedKPIs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No assigned KPIs found.
                </td>
              </tr>
            ) : (
              filteredAssignedKPIs.map((assignment) => {
                const id = assignment._id;
                const isEditing = editStates[id]?.editing;
                const isSaving = savingIds.has(id);

                return (
                  <tr key={id}>
                    <td className="border px-4 py-2">
                      {assignment.subsectorId
                        ? getSectorNameFromSubsector(assignment.subsectorId)
                        : getSectorNameFromSectorId(assignment.sectorId)}
                    </td>
                    <td className="border px-4 py-2">
                      {typeof assignment.subsectorId === "object"
                        ? assignment.subsectorId?.subsector_name
                        : subsectors.find((s) => s._id === assignment.subsectorId)?.subsector_name || "-"}
                    </td>
                    <td className="border px-4 py-2">{assignment.kpiId?.kra?.kra_name || "-"}</td>
                    <td className="border px-4 py-2">{assignment.kpiId?.kpi_name || "-"}</td>
                    <td className="border px-4 py-2 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editStates[id]?.startYear}
                          onChange={(e) => handleYearChange(id, "startYear", e.target.value)}
                          className="border px-2 py-1 rounded w-20 text-center"
                        />
                      ) : (
                        editStates[id]?.startYear || "-"
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editStates[id]?.endYear}
                          onChange={(e) => handleYearChange(id, "endYear", e.target.value)}
                          className="border px-2 py-1 rounded w-20 text-center"
                        />
                      ) : (
                        editStates[id]?.endYear || "-"
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() =>
                              handleSaveYears(
                                id,
                                assignment.kpiId?._id,
                                assignment.sectorId,
                                assignment.subsectorId,
                                assignment.deskId
                              )
                            }
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => handleEditToggle(id)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditToggle(id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
>>>>>>> Stashed changes
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KpiYearAssignmentPage;
