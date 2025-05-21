import React from "react";

function KPITable({ groupKey, rows, openModal, openPerformanceModal }) {
  const [goal, kra] = groupKey.split("||");

  return (
    <div className="mb-8">
      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr>
            <th
              colSpan={6}
              className="border border-gray-400 bg-gray-200 text-center py-2 font-bold"
            >
              Goal: {goal}
            </th>
          </tr>
          <tr>
            <th
              colSpan={6}
              className="border border-gray-400 bg-gray-100 text-center py-2 font-semibold"
            >
              KRA: {kra}
            </th>
          </tr>
          <tr>
            <th className="border border-gray-400 px-2 py-1">KPI Name</th>
            <th className="border border-gray-400 px-2 py-1">Year</th>
            <th className="border border-gray-400 px-2 py-1">Q1</th>
            <th className="border border-gray-400 px-2 py-1">Q2</th>
            <th className="border border-gray-400 px-2 py-1">Q3</th>
            <th className="border border-gray-400 px-2 py-1">Q4</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {row.kpiName}
              </td>
              {["year", "q1", "q2", "q3", "q4"].map((field) => (
                <td
                  key={field}
                  className="border border-gray-300 px-2 py-1 text-center"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className="space-x-1">
                      <button
                        onClick={() => openModal(row, field)}
                        className="bg-green-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
                      >
                        Plan
                      </button>
                      <button
                        className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
                        onClick={() => openPerformanceModal(row, field)}
                      >
                        Performance
                      </button>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KPITable;
