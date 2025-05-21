import React from "react";

function Filters({
  filterYear,
  setFilterYear,
  filterGoal,
  setFilterGoal,
  filterKra,
  setFilterKra,
  setFilterKpiName,
  filterKpiName,
}) {
  return (
    <div className="mb-4 rounded space-y-2 flex justify-between bg-green-600 p-6 text-white font-semibold">
      <div className="flex flex-col gap-2">
        <label className="mr-2 font-mediumn ">Filter by Year:</label>
        <input
          type="text"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border border-gray-50 px-2 py-1 rounded outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="mr-2 font-medium">Filter by Goal:</label>
        <input
          type="text"
          value={filterGoal}
          onChange={(e) => setFilterGoal(e.target.value)}
          className="border border-gray-50 px-2 py-1 rounded outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="mr-2 font-medium">Filter by KRA:</label>
        <input
          type="text"
          value={filterKra}
          onChange={(e) => setFilterKra(e.target.value)}
          className="border border-gray-50 px-2 py-1 rounded  outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="mr-2 font-medium">Filter by KPI Name:</label>
        <input
          type="text"
          value={filterKpiName}
          onChange={(e) => setFilterKpiName(e.target.value)}
          className="border border-gray-50 px-2 py-1 rounded outline-none"
        />
      </div>
    </div>
  );
}

export default Filters;
