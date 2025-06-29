import { useState } from "react";

const initialWorkers = ["Alice", "Bob", "Charlie", "Diana"];

export default function ViewAssignments({ assignments, setAssignments }) {
  const [selectedWorker, setSelectedWorker] = useState("");

  const togglePerformance = (index) => {
    const updated = [...assignments];
    updated[index].performed = !updated[index].performed;
    setAssignments(updated);
    localStorage.setItem("assignments", JSON.stringify(updated));
  };

  const filtered = assignments
    .map((a, idx) => ({ ...a, idx }))
    .filter((a) => a.worker === selectedWorker);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">View Assigned Targets</h3>

      <select
        value={selectedWorker}
        onChange={(e) => setSelectedWorker(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Worker</option>
        {initialWorkers.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <div className="space-y-2">
        {filtered.length ? (
          filtered.map((a) => (
            <div key={a.idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={a.performed}
                onChange={() => togglePerformance(a.idx)}
              />
              <span>
                {a.kpi} - {a.measure}: Target = {a.target}
              </span>
            </div>
          ))
        ) : (
          <p>No targets assigned.</p>
        )}
      </div>
    </div>
  );
}
