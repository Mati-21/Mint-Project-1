export default function PerformanceTable({ assignments }) {
  const kpiData = {};
  assignments.forEach((a) => {
    if (!kpiData[a.kpi]) kpiData[a.kpi] = { target: 0, performance: 0 };
    kpiData[a.kpi].target += a.target;
    if (a.performed) kpiData[a.kpi].performance += a.target;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">KPI Performance Table</h3>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">KPI</th>
            <th className="p-2 border">Target Total</th>
            <th className="p-2 border">Performance</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(kpiData).map(([kpi, data]) => (
            <tr key={kpi}>
              <td className="p-2 border">{kpi}</td>
              <td className="p-2 border">{data.target}</td>
              <td className="p-2 border">{data.performance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
