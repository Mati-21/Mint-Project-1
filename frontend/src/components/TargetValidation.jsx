import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/auth.store"; // adjust path if needed

const BACKEND_PORT = 1221;
const backendUrl = `http://localhost:${BACKEND_PORT}`;

function useSectors() {
  const [sectors, setSectors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`${backendUrl}/api/sector/get-sector`)
      .then(res => setSectors(res.data.data || []))
      .catch(() => setError("Failed to load sectors"));
  }, []);
  return { sectors, error };
}

function useSubsectors() {
  const [subsectors, setSubsectors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`${backendUrl}/api/subsector/get-subsector`)
      .then(res => setSubsectors(res.data || []))
      .catch(() => setError("Failed to load subsectors"));
  }, []);
  return { subsectors, error };
}

// Helper: map role string to proper validation prefix key in camelCase
function getValidationPrefix(role) {
  role = role.toLowerCase();
  if (role === "ceo") return "ceo";
  if (role === "chief ceo" || role === "chiefceo") return "chiefCeo";
  if (role === "strategic unit" || role === "strategicunit") return "strategic";
  if (role === "minister") return "minister"; // adjust if needed
  return ""; // fallback
}

const Filter = ({
  year, setYear,
  quarter, setQuarter,
  sectors, sector, setSector,
  filteredSubsectors, subsector, setSubsector,
  statusFilter, setStatusFilter,
  onFilter, loading
}) => {
  const quarters = ["year", "q1", "q2", "q3", "q4"];
  const statuses = ["", "Approved", "Pending", "Rejected"];

  return (
    <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label>Year</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          min="2000"
          max="2100"
          className="border px-3 py-1.5 rounded"
        />
      </div>
      <div>
        <label>Period</label>
        <select
          value={quarter}
          onChange={e => setQuarter(e.target.value)}
          className="border px-3 py-1.5 rounded"
        >
          {quarters.map(q => (
            <option key={q} value={q}>{q.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Sector</label>
        <select
          value={sector}
          onChange={e => {
            setSector(e.target.value);
            setSubsector("");
          }}
          className="border px-3 py-1.5 rounded"
        >
          <option value="">All</option>
          {sectors.map(sec => (
            <option key={sec._id} value={sec._id}>{sec.sector_name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Subsector</label>
        <select
          value={subsector}
          onChange={e => setSubsector(e.target.value)}
          disabled={!sector}
          className="border px-3 py-1.5 rounded"
        >
          <option value="">All</option>
          {filteredSubsectors.map(ss => (
            <option key={ss._id} value={ss._id}>{ss.subsector_name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Status</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border px-3 py-1.5 rounded"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === "" ? "All" : s}</option>
          ))}
        </select>
      </div>
      <button
        onClick={onFilter}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Filtering..." : "Filter"}
      </button>
    </div>
  );
};

const TargetValidation = () => {
  const { user } = useAuthStore();
  const myRole = user?.role || "";
  const prefix = getValidationPrefix(myRole);

  const { sectors, error: sectorError } = useSectors();
  const { subsectors, error: subsectorError } = useSubsectors();

  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState("year");
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [plans, setPlans] = useState([]);
  const [edits, setEdits] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [error, setError] = useState(null);

  const filteredSubsectors = subsectors.filter(ss => {
    if (!sector) return true;
    const id = ss.sectorId?._id || ss.sectorId;
    return String(id) === String(sector);
  });

  const fetchPlans = async () => {
    setLoadingFetch(true);
    setLoading(true);
    if (!year) {
      setError("Year is required to filter plans.");
      setLoading(false);
      setLoadingFetch(false);
      return;
    }
    try {
      const params = { year: String(year), quarter };
      if (sector) params.sector = sector;
      if (subsector) params.subsector = subsector;
      if (statusFilter) params.statusFilter = statusFilter;
      params.role = myRole.toLowerCase();

      console.log("[Frontend] Sending filter request with params:", params);

      const res = await axios.get(`${backendUrl}/api/target-validation`, {
        params,
        withCredentials: true,
        headers: {
          "x-user-role": myRole,
          "x-sector-id": user?.sector?._id || "",
          "x-subsector-id": user?.subsector?._id || ""
        }
      });

      console.log("[Frontend] Received plans response:", res.data);

      setPlans(res.data || []);
      setError(null);
    } catch (e) {
      console.error("[Frontend] Error fetching plans:", e);
      setError("Failed to load plans");
    } finally {
      setLoading(false);
      setLoadingFetch(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // Filter by year, sector, subsector and validation field presence
  const filtered = plans.filter(plan => {
    if (String(plan.year) !== String(year)) return false;
    // Check the validation status field exists on the plan
    if (quarter === "year" && plan[`${prefix}ValidationYear`] === undefined) return false;
    if (quarter !== "year" && plan[`${prefix}Validation${quarter.toUpperCase()}`] === undefined) return false;
    if (sector && String(plan.sectorId?._id || plan.sectorId) !== String(sector)) return false;
    if (subsector && String(plan.subsectorId?._id || plan.subsectorId) !== String(subsector)) return false;
    if (statusFilter && statusFilter !== "" && plan[quarter === "year"
      ? `${prefix}ValidationYear`
      : `${prefix}Validation${quarter.toUpperCase()}`] !== statusFilter) return false;
    return true;
  });

  // Group by Goal and KRA
  const grouped = filtered.reduce((acc, plan) => {
    const goal = plan.goalId?.goal_desc || "-";
    const kra = plan.kraId?.kra_name || "-";
    const key = `${goal}|||${kra}`;
    acc[key] = acc[key] || [];
    acc[key].push(plan);
    return acc;
  }, {});

  const handleCheckbox = (id) => {
    setEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: prev[id]?.status === "Approved" ? "Pending" : "Approved"
      }
    }));
  };

  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    const newEdits = {};
    Object.values(grouped).flat().forEach(plan => {
      newEdits[plan._id] = { ...edits[plan._id], status: newVal ? "Approved" : "Pending" };
    });
    setEdits(newEdits);
  };

  const handleComment = (id, val) => {
    setEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], description: val }
    }));
  };

  const submitOne = async (id) => {
    const { status = "Pending", description = "" } = edits[id] || {};

    try {
      await axios.patch(`${backendUrl}/api/target-validation/validate/${id}`, {
        type: quarter,
        status,
        description,
        role: myRole.toLowerCase()
      }, {
        withCredentials: true,
        headers: { "x-user-role": myRole }
      });
      alert("Validation saved.");
    } catch {
      alert("Failed to save validation.");
    }
  };

  const submitBulk = async () => {
    const ids = Object.entries(edits)
      .filter(([, e]) => e.status === "Approved")
      .map(([id]) => id);
    if (!ids.length) return alert("No selections made.");

    for (const id of ids) {
      const { status = "Approved", description = "" } = edits[id] || {};
      await axios.patch(`${backendUrl}/api/target-validation/validate/${id}`, {
        type: quarter,
        status,
        description,
        role: myRole.toLowerCase()
      }, {
        withCredentials: true,
        headers: { "x-user-role": myRole }
      }).catch(console.error);
    }

    alert("Bulk validation sent.");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (sectorError || subsectorError) return <p className="p-6 text-red-600">Loading filters failed.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        KPI Target Validation — {year} / {quarter.toUpperCase()}
      </h1>
      <p className="mb-5 text-gray-600">Filter and validate KPI targets.</p>

      <button
        onClick={fetchPlans}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch All Plans
      </button>

      <Filter
        year={year} setYear={setYear}
        quarter={quarter} setQuarter={setQuarter}
        sectors={sectors} sector={sector} setSector={setSector}
        filteredSubsectors={filteredSubsectors}
        subsector={subsector} setSubsector={setSubsector}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onFilter={fetchPlans}
        loading={loadingFetch}
      />

      {Object.entries(grouped).map(([key, items]) => {
        const [goal, kra] = key.split("|||");
        return (
          <div key={key} className="mb-10">
            <div className="bg-yellow-100 p-2 font-bold">{`Goal: ${goal}`}</div>
            <div className="bg-gray-200 p-2 font-semibold">{`KRA: ${kra}`}</div>
            <table className="w-full border-collapse shadow-lg mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Indicator</th>
                  <th className="border p-2">Value</th>
                  <th className="border p-2">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} /> Validate
                  </th>
                  <th className="border p-2">Comments</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(plan => {
                  const validationStatusField = quarter === "year"
                    ? `${prefix}ValidationYear`
                    : `${prefix}Validation${quarter.toUpperCase()}`;

                  const validationDescField = quarter === "year"
                    ? `${prefix}ValidationDescriptionYear`
                    : `${prefix}ValidationDescription${quarter.toUpperCase()}`;

                  const value = plan.target ?? plan.value ?? "-";

                  const status = edits[plan._id]?.status ?? plan[validationStatusField] ?? "Pending";
                  const description = edits[plan._id]?.description ?? plan[validationDescField] ?? "";

                  return (
                    <tr key={plan._id} className="hover:bg-gray-50">
                      <td className="border p-2">{plan.kpiId?.kpi_name}</td>
                      <td className="border p-2">{value}</td>
                      <td className="border p-2 text-center">
                        <input
                          type="checkbox"
                          checked={status === "Approved"}
                          onChange={() => handleCheckbox(plan._id)}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={description}
                          onChange={e => handleComment(plan._id, e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => submitOne(plan._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {filtered.length === 0 && <p className="text-center text-gray-500">No KPI targets found.</p>}

      {filtered.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={submitBulk}
            className="bg-green-700 text-white px-6 py-2 rounded"
          >
            Validate All Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default TargetValidation;
