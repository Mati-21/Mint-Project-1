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
        console.log("Sector API response:", res); // <--- Add this
        setSectors(res.data.data || []);
        console.log("Fetched sectors:", res.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load sectors");
        console.error("Error fetching sectors:", err);
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
        console.log("Subsector API response:", res);
        setSubsectors(res.data || []); // <-- Fix here
        console.log("Fetched subsectors:", res.data); // <-- Fix here
        setError(null);
      } catch (err) {
        setError("Failed to load subsectors");
        console.error("Error fetching subsectors:", err);
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
  onFilter, // <-- Add this prop
  loadingPlans, // <-- Add this prop
}) => {
  const years = [2016, 2024, 2025];
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
            setSubsector(""); // reset subsector when sector changes
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

const TargetValidation = () => {
  const [plans, setPlans] = useState([]);
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

  // Fetch all plans (no filters)
  const fetchAllPlans = async () => {
    setLoadingPlans(true);
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/plans`);
      console.log("Raw /api/plans response:", res);

      // Use res.data directly, since it's an array
      const fetchedPlans = Array.isArray(res.data) ? res.data : [];
      setPlans(fetchedPlans);
      console.log("Fetched all plans (raw):", fetchedPlans);
      setError(null);
    } catch (err) {
      setError("Failed to load all plans");
      console.error("Error fetching all plans:", err);
    } finally {
      setLoading(false);
      setLoadingPlans(false);
    }
  };

  // **Updated subsector filtering - matches Result Framework logic**
  // Filter subsectors where ss.sectorId?._id (or ss.sectorId) equals selected sector id
  // Allow "All" if no sector selected
  const filteredSubsectors = subsectors.filter((ss) => {
    if (!sector) return true; // no sector selected: show all subsectors
    // sectorId may be object or string - normalize
    const ssSectorId = ss.sectorId?._id || ss.sectorId;
    if (!ssSectorId) return false; // subsector without sectorId shouldn't show if sector selected
    return String(ssSectorId) === String(sector);
  });

  // Fetch plans with filters
  const fetchPlans = async () => {
    setLoadingPlans(true);
    setLoading(true);
    try {
      // Build query params
      const params = {
        year,
        quarter,
      };
      if (sector) params.sector = sector;
      if (subsector) params.subsector = subsector;

      // Add this console to see what is sent as request params
      console.log("Fetching plans with params:", params);

      const res = await axios.get(`${backendUrl}/api/plans`, { params });
      setPlans(Array.isArray(res.data) ? res.data : res.data.plans || []);
      setError(null);
    } catch (err) {
      setError("Failed to load plans");
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
      setLoadingPlans(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, []);

  // Filter plans based on year, quarter, sector, subsector and target existence
  const filteredPlans = plans.filter((plan) => {
    if (String(plan.year) !== String(year)) return false;
    if (quarter === "year") {
      if (plan.target == null) return false;
    } else {
      if (plan[quarter] == null) return false;
    }
    const planSectorId = plan.sectorId?._id || plan.sectorId;
    const planSubsectorId = plan.subsectorId?._id || plan.subsectorId;
    if (sector && String(planSectorId) !== String(sector)) return false;
    if (subsector && String(planSubsectorId) !== String(subsector)) return false;
    return true;
  });

  // Group plans by goal and kra
  const groupedPlans = {};
  filteredPlans.forEach((plan) => {
    const goal = plan.goalId?.goal_desc || "-";
    const kra = plan.kraId?.kra_name || "-";
    const key = `${goal}|||${kra}`;
    if (!groupedPlans[key]) groupedPlans[key] = [];
    groupedPlans[key].push(plan);
  });

  // Handlers for edits
  const handleCheckboxChange = (planId) => {
    setEdits((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        status: prev[planId]?.status === "Approved" ? "Pending" : "Approved",
      },
    }));
  };

  const handleSelectAllChange = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    const newEdits = {};
    Object.values(groupedPlans)
      .flat()
      .forEach((plan) => {
        newEdits[plan._id] = {
          ...edits[plan._id],
          status: newState ? "Approved" : "Pending",
        };
      });
    setEdits(newEdits);
  };

  const handleCommentChange = (planId, value) => {
    setEdits((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        description: value,
      },
    }));
  };

  const submitValidation = async (planId) => {
    const { status = "Pending", description = "" } = edits[planId] || {};
    try {
      await axios.patch(`${backendUrl}/api/target-validation/validate/${planId}`, {
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

  console.log("plans:", plans);
  console.log("year filter:", year, "quarter filter:", quarter, "sector filter:", sector, "subsector filter:", subsector);

  if (loading) return <p className="text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (sectorError) return <p className="text-red-600">{sectorError}</p>;
  if (subsectorError) return <p className="text-red-600">{subsectorError}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-2">
        KPI Target Validation - {year} / {quarter.toUpperCase()}
      </h1>
      <p className="mb-5 text-gray-600">Use filters below to validate KPI targets.</p>

      <button
        onClick={fetchAllPlans}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch All Plans (Show in Console)
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
        onFilter={fetchPlans}
        loadingPlans={loadingPlans}
      />

      {/* Group by goal first */}
      {Object.entries(
        Object.groupBy
          ? Object.groupBy(filteredPlans, (plan) => plan.goalId?.goal_desc || "-")
          : filteredPlans.reduce((acc, plan) => {
              const goal = plan.goalId?.goal_desc || "-";
              acc[goal] = acc[goal] || [];
              acc[goal].push(plan);
              return acc;
            }, {})
      ).map(([goal, plansForGoal]) => {
        // Group by KRA within each goal
        const kraGroups = plansForGoal.reduce((acc, plan) => {
          const kra = plan.kraId?.kra_name || "-";
          acc[kra] = acc[kra] || [];
          acc[kra].push(plan);
          return acc;
        }, {});

        return (
          <div key={goal} className="mb-10">
            <div className="bg-yellow-100 font-bold text-lg px-4 py-2 rounded-t">
              Goal: {goal}
            </div>
            {Object.entries(kraGroups).map(([kra, plansInKra]) => (
              <table
                key={kra}
                className="w-full border border-collapse mt-0 shadow-2xl mb-6"
              >
                <thead>
                  <tr className="bg-gray-200">
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
                  {plansInKra.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-500">
                        No KPI targets found for the selected filters.
                      </td>
                    </tr>
                  )}
                  {plansInKra.map((plan) => {
                    const value = quarter === "year" ? plan.target : plan[quarter];
                    const status = edits[plan._id]?.status ?? plan.status ?? "Pending";
                    const description =
                      edits[plan._id]?.description ?? plan.validation_description ?? "";

                    return (
                      <tr key={plan._id} className="hover:bg-gray-50">
                        <td className="border p-2">{plan.kpiId?.kpi_name || "Unknown KPI"}</td>
                        <td className="border p-2">{value ?? "-"}</td>
                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={status === "Approved"}
                            onChange={() => handleCheckboxChange(plan._id)}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => handleCommentChange(plan._id, e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            placeholder="Add comment"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => submitValidation(plan._id)}
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
            ))}
          </div>
        );
      })}
      {/* If no plans at all */}
      {filteredPlans.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No KPI targets found for the selected filters.
        </div>
      )}
      {filteredPlans.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
            onClick={async () => {
              // Get all selected (approved) plan IDs
              const selectedPlanIds = Object.entries(edits)
                .filter(([_, edit]) => edit.status === "Approved")
                .map(([planId]) => planId);

              if (selectedPlanIds.length === 0) {
                alert("No rows selected for validation.");
                return;
              }

              // Validate all selected plans
              for (const planId of selectedPlanIds) {
                const { status = "Approved", description = "" } = edits[planId] || {};
                try {
                  await axios.patch(`${backendUrl}/api/target-validation/validate/${planId}`, {
                    type: quarter,
                    status,
                    description,
                  });
                } catch (err) {
                  console.error(`Failed to validate plan ${planId}:`, err);
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

export default TargetValidation;
