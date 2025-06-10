import React from "react";

const kpiData = [
  {
    kpi: "Developed government institutions' mobile application platforms/frameworks (in number)",
    performance: 1.0,
    progress: 33,
  },
  {
    kpi: "Companies sailing via e-commerce platforms (in number)",
    performance: 746.0,
    progress: 100,
  },
  {
    kpi: "Developed electronic government service centres (in number)",
    performance: 5.0,
    progress: 100,
  },
  {
    kpi: "Established government services call centres (in number)",
    performance: 11.0,
    progress: 100,
  },
  {
    kpi: "Public services delivered electronically (in number)",
    performance: 737.0,
    progress: 74,
  },
  {
    kpi: "Established E-commerce centres (in number)",
    performance: 1.0,
    progress: 100,
  },
  {
    kpi: "E-commerce platforms (in number)",
    performance: 50.0,
    progress: 60,
  },
  {
    kpi: "Share of public services delivered online via cloud system (in per cent)",
    performance: 20.0,
    progress: 100,
  },
];

const ProgressBar = ({ progress }) => {
  const getColor = (val) => {
    if (val >= 100) return "bg-green-500";
    if (val >= 74) return "bg-green-400";
    if (val >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 ${getColor(progress)}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const KPIProgressTable = () => {
  return (
    <div className="max-w-xl mx-auto p-4 shadow-xl mb-10">
      <h2 className="text-xl font-semibold mb-4">Recent Performance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">KPI</th>
              <th className="p-3 border-b">Performance</th>
              <th className="p-3 border-b">Progress</th>
              <th className="p-3 border-b">Label</th>
            </tr>
          </thead>
          <tbody>
            {kpiData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.kpi}</td>
                <td className="p-3">{item.performance}</td>
                <td className="p-3 w-20">
                  <ProgressBar progress={item.progress} />
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.progress === 100
                        ? "bg-green-100 text-green-800"
                        : item.progress >= 74
                        ? "bg-green-100 text-green-600"
                        : item.progress >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.progress}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIProgressTable;
