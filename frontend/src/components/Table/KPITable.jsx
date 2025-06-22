import React, { useState } from "react";

function KPITable({ groupKey, rows, openModal, openPerformanceModal, openRatioModal, currentEthYear }) {
  const [goal, kra] = groupKey.split("||");
  const [showDebug, setShowDebug] = useState(false);

  const recentYear = currentEthYear;
  const previousYear = currentEthYear - 1;

  // Format ratio value as percentage string
  const formatRatio = (perf, target) => {
    if (typeof perf === "number" && typeof target === "number" && target !== 0) {
      const ratio = (perf / target) * 100;
      return `${Math.round(ratio)}%`;
    }
    return "Ratio";
  };

  function renderPlanCell(row, periodKey) {
    const targetValue = row.targets?.[periodKey];
    return (
      <button
        onClick={() => openModal({ ...row, period: periodKey })}
        className="bg-green-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        {targetValue != null && targetValue !== "" ? `Target: ${targetValue}` : "Plan"}
      </button>
    );
  }

  function renderPerformanceCell(row, periodKey) {
    const performanceValue = row.performance?.[periodKey];
    return (
      <button
        onClick={() => openPerformanceModal({ ...row, period: periodKey })}
        className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        {performanceValue != null && performanceValue !== "" ? `Perf: ${performanceValue}` : "Perf."}
      </button>
    );
  }

  function renderRatioCell(row, periodKey) {
    const targetValue = row.targets?.[periodKey];
    const performanceValue = row.performance?.[periodKey];

    return (
      <button
        onClick={() => openRatioModal(row, periodKey)}
        className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs cursor-pointer"
      >
        {!isNaN(Number(performanceValue)) && !isNaN(Number(targetValue)) && Number(targetValue) !== 0
          ? formatRatio(Number(performanceValue), Number(targetValue))
          : "Ratio"}
      </button>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-2">
        <strong>Goal:</strong> {goal} &nbsp; | &nbsp; <strong>KRA:</strong> {kra}
      </div>

      <button
        onClick={() => setShowDebug((prev) => !prev)}
        className="mb-4 px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
      >
        {showDebug ? "Hide debug JSON" : "Show debug JSON"}
      </button>

      {showDebug && (
        <pre
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            padding: "10px",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}

      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
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
