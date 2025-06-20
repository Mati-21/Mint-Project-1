import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/auth.store"; // adjust path if needed

const BACKEND_PORT = 1221;
const backendUrl = `http://localhost:${BACKEND_PORT}`;

// Custom hook to fetch sectors
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

// Custom hook to fetch subsectors
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

// Filter UI
const Filter = ({
  year, setYear,
  quarter, setQuarter,
  sectors, sector, setSector,
  filteredSubsectors, subsector, setSubsector,
  onFilter, loading
}) => {
  const quarters = ["year", "q1", "q2", "q3", "q4"];

  return (
    <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label>Year</label>
        <input type="number" value={year}
          onChange={e => setYear(e.target.value)}
          min="2000" max="2100" className="border px-3 py-1.5 rounded" />
      </div>
      <div>
        <label>Period</label>
        <select value={quarter}
          onChange={e => setQuarter(e.target.value)}
          className="border px-3 py-1.5 rounded">
          {quarters.map(q =>
            <option key={q} value={q}>{q.toUpperCase()}</option>
          )}
        </select>
      </div>
      <div>
        <label>Sector</label>
        <select value={sector}
          onChange={e => { setSector(e.target.value); setSubsector(""); }}
          className="border px-3 py-1.5 rounded">
          <option value="">All</option>
          {sectors.map(sec =>
            <option key={sec._id} value={sec._id}>{sec.sector_name}</option>
          )}
        </select>
      </div>
      <div>
        <label>Subsector</label>
        <select value={subsector}
          onChange={e => setSubsector(e.target.value)}
          disabled={!sector}
          className="border px-3 py-1.5 rounded">
          <option value="">All</option>
          {filteredSubsectors.map(ss =>
            <option key={ss._id} value={ss._id}>{ss.subsector_name}</option>
          )}
        </select>
      </div>
      <button onClick={onFilter}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? "Filtering..." : "Filter"}
      </button>
    </div>
  );
};

// Main Component
const PerformanceValidation = () => {
  const { user } = useAuthStore();
  const myRole = user?.role || "";

  const { sectors, error: sectorError } = useSectors();
  const { subsectors, error: subsectorError } = useSubsectors();

  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState("year");
  const [sector, setSector] = useState("");
  const [subsector, setSubsector] = useState("");

  const [performances, setPerformances] = useState([]);
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

  const fetchPerformances = async () => {
    setLoadingFetch(true);
    setLoading(true);
    if (!year) {
      setError("Year is required to filter performances.");
      setLoading(false);
      setLoadingFetch(false);
      return;
    }
    try {
      const params = { year: String(year) };
      if (quarter && quarter !== "year") params.quarter = quarter;
      if (sector) params.sectorId = sector;
      if (subsector) params.subsectorId = subsector;

      console.log("📤 Fetching performances with params:", params);

      const res = await axios.get(`${backendUrl}/api/performance-validation`, {
        params,
        withCredentials: true,
        headers: {
          "x-user-role": user?.role || "",
          "x-sector-id": user?.sector?._id || "",
          "x-subsector-id": user?.subsector?._id || ""
        }
      });

      console.log("📦 Performances fetched:", res.data);

      setPerformances(res.data || []);
      setError(null);
    } catch (e) {
      console.error("❌ Error fetching performances:", e);
      setError("Failed to load performances");
    } finally {
      setLoading(false);
      setLoadingFetch(false);
    }
  };

  useEffect(() => { fetchPerformances(); }, []);

  const filtered = performances.filter(perf => {
    if (String(perf.year) !== String(year)) return false;
    if (quarter === "year" && perf.performanceYear == null) return false;
    if (quarter !== "year" && perf[`${quarter}Performance`]?.value == null) return false;
    if (sector && String(perf.sectorId?._id || perf.sectorId) !== String(sector)) return false;
    if (subsector && String(perf.subsectorId?._id || perf.subsectorId) !== String(subsector)) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, perf) => {
    const goal = perf.goalId?.goal_desc || "-";
    const kra = perf.kraId?.kra_name || "-";
    const key = `${goal}|||${kra}`;
    acc[key] = acc[key] || [];
    acc[key].push(perf);
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
    Object.values(grouped).flat().forEach(perf => {
      newEdits[perf._id] = { ...edits[perf._id], status: newVal ? "Approved" : "Pending" };
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
      await axios.patch(`${backendUrl}/api/performance-validation/validate/${id}`, {
        type: quarter,
        status,
        description
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
      await axios.patch(`${backendUrl}/api/performance-validation/validate/${id}`, {
        type: quarter,
        status,
        description
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
        KPI Performance Validation — {year} / {quarter.toUpperCase()}
      </h1>
      <p className="mb-5 text-gray-600">Filter and validate KPI performances.</p>

      <button onClick={fetchPerformances}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Fetch All Performances
      </button>

      <Filter
        year={year} setYear={setYear}
        quarter={quarter} setQuarter={setQuarter}
        sectors={sectors} sector={sector} setSector={setSector}
        filteredSubsectors={filteredSubsectors}
        subsector={subsector} setSubsector={setSubsector}
        onFilter={fetchPerformances}
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
                {items.map(perf => {
                  const value = quarter === "year"
                    ? perf.performanceYear
                    : perf[`${quarter}Performance`]?.value;
                  const status = edits[perf._id]?.status ?? perf.status ?? "Pending";
                  const description = edits[perf._id]?.description ??
                    (quarter === "year" ? perf.performanceDescription : perf[`${quarter}Performance`]?.description) ?? "";

                  return (
                    <tr key={perf._id} className="hover:bg-gray-50">
                      <td className="border p-2">{perf.kpiId?.kpi_name}</td>
                      <td className="border p-2">{value ?? "-"}</td>
                      <td className="border p-2 text-center">
                        <input type="checkbox"
                          checked={status === "Approved"}
                          onChange={() => handleCheckbox(perf._id)} />
                      </td>
                      <td className="border p-2">
                        <input type="text" value={description}
                          onChange={e => handleComment(perf._id, e.target.value)}
                          className="w-full border rounded px-2 py-1" />
                      </td>
                      <td className="border p-2 text-center">
                        <button onClick={() => submitOne(perf._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {filtered.length === 0 && <p className="text-center text-gray-500">No KPI performances found.</p>}

      {filtered.length > 0 && (
        <div className="flex justify-end">
          <button onClick={submitBulk} className="bg-green-700 text-white px-6 py-2 rounded">
            Validate All Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceValidation;
