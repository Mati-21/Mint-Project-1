import React from "react";

function Filters({
  filterYear,
  setFilterYear,
  filterGoal,
  setFilterGoal,
  filterKra,
  setFilterKra,
  filterKpiName,
  setFilterKpiName,
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Filter by Year"
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="border rounded px-3 py-1"
      />
      <input
        type="text"
        placeholder="Filter by Goal"
        value={filterGoal}
        onChange={(e) => setFilterGoal(e.target.value)}
        className="border rounded px-3 py-1"
      />
      <input
        type="text"
        placeholder="Filter by KRA"
        value={filterKra}
        onChange={(e) => setFilterKra(e.target.value)}
        className="border rounded px-3 py-1"
      />
      <input
        type="text"
        placeholder="Filter by KPI Name"
        value={filterKpiName}
        onChange={(e) => setFilterKpiName(e.target.value)}
        className="border rounded px-3 py-1"
      />
    </div>
  );
}

export default Filters;
