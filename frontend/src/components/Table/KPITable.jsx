
import React from "react";

function KPITable({ groupKey, rows, openModal, openPerformanceModal, openRatioModal, currentEthYear }) {
  const [goal, kra] = groupKey.split("||");

  const recentYear = currentEthYear;
  const previousYear = currentEthYear - 1;

  // Plan cell (Target)
  function renderPlanCell(row, periodKey) {
    const targetValue = row.targets?.[periodKey];
    if (targetValue !== undefined && targetValue !== null && targetValue !== "") {
      return <span className="font-semibold text-green-700">{targetValue}</span>;
    }
    return (
      <button
        onClick={() => openModal({ ...row, period: periodKey })}
        className="bg-green-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        Plan
      </button>
    );
  }

  // Performance cell
  function renderPerformanceCell(row, periodKey) {
    const performanceValue = row.performance?.[periodKey];
    if (performanceValue !== undefined && performanceValue !== null && performanceValue !== "") {
      return <span className="font-semibold text-blue-700">{performanceValue}</span>;
    }
    return (
      <button
        onClick={() => openPerformanceModal({ ...row, period: periodKey })}
        className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        Perf.
      </button>
    );
  }

  // Ratio cell (button only, no separate header)
  function renderRatioCell(row, periodKey) {
    return (
      <button
        onClick={() => openRatioModal(row, periodKey)}
        className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        Ratio
      </button>
    );
  }

  return (
    <div className="mb-8">
      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr>
            <th colSpan={7} className="border border-gray-400 bg-gray-200 text-center py-2 font-bold">
              Goal: {goal}
            </th>
          </tr>
          <tr>
            <th colSpan={7} className="border border-gray-400 bg-gray-100 text-center py-2 font-semibold">
              KRA: {kra}
            </th>
          </tr>
          <tr>
            <th className="border border-gray-400 px-2 py-1">KPI Name</th>
            <th className="border border-gray-400 px-2 py-1 text-center">{previousYear}</th>
            <th className="border border-gray-400 px-2 py-1 text-center">{recentYear}</th>
            <th className="border border-gray-400 px-2 py-1 text-center">Q1</th>
            <th className="border border-gray-400 px-2 py-1 text-center">Q2</th>
            <th className="border border-gray-400 px-2 py-1 text-center">Q3</th>
            <th className="border border-gray-400 px-2 py-1 text-center">Q4</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-2 py-1 text-center">{row.kpiName}</td>

              {[`year-${previousYear}`, `year-${recentYear}`].map((periodKey) => (
                <td key={periodKey} className="border border-gray-300 px-2 py-1 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    {renderPlanCell(row, periodKey)}
                    {renderPerformanceCell(row, periodKey)}
                    {renderRatioCell(row, periodKey)}
                  </div>
                </td>
              ))}

              {["q1", "q2", "q3", "q4"].map((q) => {
                const periodKey = `${q}-${recentYear}`;
                return (
                  <td key={q} className="border border-gray-300 px-2 py-1 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      {renderPlanCell(row, periodKey)}
                      {renderPerformanceCell(row, periodKey)}
                      {renderRatioCell(row, periodKey)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KPITable;