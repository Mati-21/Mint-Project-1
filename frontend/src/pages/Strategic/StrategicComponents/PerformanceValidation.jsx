import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_PORT = 1221;
const backendUrl = `http://localhost:${BACKEND_PORT}`;

// Custom hook to fetch sectors
function useSectors() {
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchSectors() {
      try {
        const res = await axios.get(`${backendUrl}/api/sector/get-sector`);
        setSectors(res.data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load sectors");
      }
    }
    fetchSectors();
  }, []);
  return { sectors, error };
}

// Custom hook to fetch subsectors
function useSubsectors() {
  const [subsectors, setSubsectors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchSubsectors() {
      try {
        const res = await axios.get(`${backendUrl}/api/subsector/get-subsector`);
        setSubsectors(res.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load subsectors");
      }
    }
    fetchSubsectors();
  }, []);
  return { subsectors, error };
}

const Filter = ({
  year,
  setYear,
  quarter,
  setQuarter,
  sectors,
  sector,
  setSector,
  filteredSubsectors,
  subsector,
  setSubsector,
  onFilter,
  loadingPlans,
}) => {
  const quarters = ["year", "q1", "q2", "q3", "q4"];
  return (
    <div className="mb-6 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-1.5"
          min="2000"
          max="2100"
          placeholder="Year"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Period</label>
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="border rounded px-3 py-1.5"
        >
          {quarters.map((q) => (
            <option key={q} value={q}>
              {q.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Sector</label>
        <select
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
            setSubsector("");
          }}
          className="border rounded px-3 py-1.5"
        >
          <option value="">All</option>
          {sectors.map((sec) => (
            <option key={sec._id} value={sec._id}>
              {sec.sector_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-700">Subsector</label>
        <select
          value={subsector}
          onChange={(e) => setSubsector(e.target.value)}
          className="border rounded px-3 py-1.5"
          disabled={!sector}
        >
          <option value="">All</option>
          {filteredSubsectors.map((ss) => (
            <option key={ss._id} value={ss._id}>
              {ss.subsector_name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onFilter}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loadingPlans}
      >
        {loadingPlans ? "Filtering..." : "Filter"}
      </button>
    </div>
  );
};

const PerformanceValidation = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState(null);

  const { sectors, error: sectorError } = useSectors();
  const { subsectors, error: subsectorError } = useSubsectors();

  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState("year");
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");
  const [edits, setEdits] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  // Fetch all performances (no filters)
  const fetchAllPerformances = async () => {
    setLoadingPlans(true);
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/performance`);
      const fetchedPerformances = Array.isArray(res.data) ? res.data : [];
      setPerformances(fetchedPerformances);
      console.log("Fetched all performances (raw):", fetchedPerformances);
      setError(null);
    } catch (err) {
      setError("Failed to load all performances");
      console.error("Error fetching all performances:", err);
    } finally {
      setLoading(false);
      setLoadingPlans(false);
    }
  };

  // Filter subsectors
  const filteredSubsectors = subsectors.filter((ss) => {
    if (!sector) return true;
    const ssSectorId = ss.sectorId?._id || ss.sectorId;
    if (!ssSectorId) return false;
    return String(ssSectorId) === String(sector);
  });

  // Fetch performances with filters
  const fetchPerformances = async () => {
    setLoadingPlans(true);
    setLoading(true);
    try {
      const params = {
        year,
      };
      // Only add quarter if it's not empty and not "year"
      if (quarter && quarter !== "year") params.quarter = quarter;
      if (sector) params.sectorId = sector;
      if (subsector) params.subsectorId = subsector;

      // Log in your requested format
      console.log(
        `year filter: ${year} quarter filter: ${params.quarter || ""} sector filter: ${sector || ""} subsector filter: ${subsector || ""}`
      );

      const res = await axios.get(`${backendUrl}/api/performance`, { params });
      setPerformances(Array.isArray(res.data) ? res.data : res.data.performances || []);
      setError(null);
    } catch (err) {
      setError("Failed to load performances");
      console.error("Error fetching performances:", err);
    } finally {
      setLoading(false);
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPerformances();
    // eslint-disable-next-line
  }, []);

  // Filter performances based on year, quarter, sector, subsector and value existence
  const filteredPerformances = performances.filter((perf) => {
    if (String(perf.year) !== String(year)) return false;
    if (quarter === "year") {
      if (perf.performanceYear == null) return false; // allow 0
    } else {
      const perfQuarter = perf[`${quarter}Performance`];
      if (!perfQuarter || perfQuarter.value == null) return false; // allow 0
    }
    const perfSectorId = perf.sectorId?._id || perf.sectorId;
    const perfSubsectorId = perf.subsectorId?._id || perf.subsectorId;
    if (sector && String(perfSectorId) !== String(sector)) return false;
    if (subsector && String(perfSubsectorId) !== String(subsector)) return false;
    return true;
  });

  // Group performances by goal and kra
  const groupedPerformances = {};
  filteredPerformances.forEach((perf) => {
    const goal = perf.goalId?.goal_desc || "-";
    const kra = perf.kraId?.kra_name || "-";
    const key = `${goal}|||${kra}`;
    if (!groupedPerformances[key]) groupedPerformances[key] = [];
    groupedPerformances[key].push(perf);
  });

  // Handlers for edits
  const handleCheckboxChange = (perfId) => {
    setEdits((prev) => ({
      ...prev,
      [perfId]: {
        ...prev[perfId],
        status: prev[perfId]?.status === "Approved" ? "Pending" : "Approved",
      },
    }));
  };

  const handleSelectAllChange = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    const newEdits = {};
    Object.values(groupedPerformances)
      .flat()
      .forEach((perf) => {
        newEdits[perf._id] = {
          ...edits[perf._id],
          status: newState ? "Approved" : "Pending",
        };
      });
    setEdits(newEdits);
  };

  const handleCommentChange = (perfId, value) => {
    setEdits((prev) => ({
      ...prev,
      [perfId]: {
        ...prev[perfId],
        description: value,
      },
    }));
  };

  const submitValidation = async (perfId) => {
    const { status = "Pending", description = "" } = edits[perfId] || {};
    try {
      await axios.patch(`${backendUrl}/api/performance-validation/validate/${perfId}`, {
        type: quarter,
        status,
        description,
      });
      alert("Validation updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update validation.");
    }
  };

  if (loading) return <p className="text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (sectorError) return <p className="text-red-600">{sectorError}</p>;
  if (subsectorError) return <p className="text-red-600">{subsectorError}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-2">
        KPI Performance Validation - {year} / {quarter.toUpperCase()}
      </h1>
      <p className="mb-5 text-gray-600">Use filters below to validate KPI performances.</p>

      <button
        onClick={fetchAllPerformances}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch All Performances (Show in Console)
      </button>

      <Filter
        year={year}
        setYear={setYear}
        quarter={quarter}
        setQuarter={setQuarter}
        sectors={sectors}
        sector={sector}
        setSector={setSector}
        filteredSubsectors={filteredSubsectors}
        subsector={subsector}
        setSubsector={setSubsector}
        onFilter={fetchPerformances}
        loadingPlans={loadingPlans}
      />

      {/* Group by goal first */}
      {Object.entries(
        Object.groupBy
          ? Object.groupBy(filteredPerformances, (perf) => perf.goalId?.goal_desc || "-")
          : filteredPerformances.reduce((acc, perf) => {
              const goal = perf.goalId?.goal_desc || "-";
              acc[goal] = acc[goal] || [];
              acc[goal].push(perf);
              return acc;
            }, {})
      ).map(([goal, perfsForGoal]) => {
        // Group by KRA within each goal
        const kraGroups = perfsForGoal.reduce((acc, perf) => {
          const kra = perf.kraId?.kra_name || "-";
          acc[kra] = acc[kra] || [];
          acc[kra].push(perf);
          return acc;
        }, {});

        return (
          <div key={goal} className="mb-10">
            {/* Debug: Log goal and KRA names */}
            {console.log("Rendering group:", { goal, kraGroups: Object.keys(kraGroups) })}

            {/* Display Goal Name */}
            <div className="bg-yellow-100 font-bold text-lg px-4 py-2 rounded-t">
              Goal: {goal}
            </div>
            {Object.entries(kraGroups).map(([kra, perfsInKra]) => {
              // Debug: Log each KRA name and the first performance's goal/kra fields
              if (perfsInKra.length > 0) {
                console.log("KRA group:", {
                  kra,
                  goalName: perfsInKra[0].goalId?.goal_desc,
                  kraName: perfsInKra[0].kraId?.kra_name,
                });
              }
              return (
                <table
                  key={kra}
                  className="w-full border border-collapse mt-0 shadow-2xl mb-6"
                >
                  <thead>
                    <tr className="bg-gray-200">
                      {/* Display KRA Name */}
                      <th colSpan={5} className="text-left px-4 py-2 font-semibold">
                        KRA: {kra}
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Indicator</th>
                      <th className="border p-3 text-left">Value</th>
                      <th className="border p-3 text-left">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                          <span>Validate</span>
                        </div>
                      </th>
                      <th className="border p-3 text-left">Comments</th>
                      <th className="border p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfsInKra.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-4 text-gray-500">
                          No KPI performances found for the selected filters.
                        </td>
                      </tr>
                    )}
                    {perfsInKra.map((perf) => {
                      const value =
                        quarter === "year"
                          ? perf.performanceYear
                          : perf[`${quarter}Performance`] && perf[`${quarter}Performance`].value !== undefined
                            ? perf[`${quarter}Performance`].value
                            : "-";
                      const status = edits[perf._id]?.status ?? perf.status ?? "Pending";
                      const description =
                        edits[perf._id]?.description ?? perf.validation_description ?? "";

                      return (
                        <tr key={perf._id} className="hover:bg-gray-50">
                          <td className="border p-2">{perf.kpiId?.kpi_name || "Unknown KPI"}</td>
                          <td className="border p-2">{value ?? "-"}</td>
                          <td className="border p-2 text-center">
                            <input
                              type="checkbox"
                              checked={status === "Approved"}
                              onChange={() => handleCheckboxChange(perf._id)}
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={description}
                              onChange={(e) => handleCommentChange(perf._id, e.target.value)}
                              className="w-full border rounded px-2 py-1"
                              placeholder="Add comment"
                            />
                          </td>
                          <td className="border p-2 text-center">
                            <button
                              onClick={() => submitValidation(perf._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })}
          </div>
        );
      })}
      {/* If no performances at all */}
      {filteredPerformances.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No KPI performances found for the selected filters.
        </div>
      )}
      {filteredPerformances.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
            onClick={async () => {
              // Get all selected (approved) performance IDs
              const selectedPerfIds = Object.entries(edits)
                .filter(([_, edit]) => edit.status === "Approved")
                .map(([perfId]) => perfId);

              if (selectedPerfIds.length === 0) {
                alert("No rows selected for validation.");
                return;
              }

              // Validate all selected performances
              for (const perfId of selectedPerfIds) {
                const { status = "Approved", description = "" } = edits[perfId] || {};
                try {
                  await axios.patch(`${backendUrl}/api/performance-validation/validate/${perfId}`, {
                    type: quarter,
                    status,
                    description,
                  });
                } catch (err) {
                  console.error(`Failed to validate performance ${perfId}:`, err);
                }
              }
              alert("Selected rows validated.");
            }}
          >
            Validate All Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceValidation;