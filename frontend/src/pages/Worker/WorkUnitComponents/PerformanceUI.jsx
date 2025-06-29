import React, { useState } from "react";

const PerformanceUI = () => {
  const [year, setYear] = useState("2024");
  const [quarter, setQuarter] = useState("Q1");
  const [rows, setRows] = useState([
    {
      indicator: "Response Time",
      target: "24",
      justification: "",
      selected: false,
      file: null,
    },
    {
      indicator: "Resolution Rate",
      target: "95",
      justification: "",
      selected: false,
      file: null,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleFileChange = (index, file) => {
    const newRows = [...rows];
    newRows[index].file = file;
    setRows(newRows);
  };

  const handleSave = (index) => {
    const row = rows[index];
    console.log("Saving row:", row);
    alert(`Saved: ${row.indicator}`);
    // Add your backend logic here
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">Performance</h2>

      {/* Goal/KRA/KPI */}
      <div className="space-y-2">
        <p>
          <span className="font-bold text-pink-600">🎯 Goal:</span> Improve
          Service Delivery
        </p>
        <p>
          <span className="font-bold text-yellow-600">🏷️ KRA:</span> Reduce
          Response Time
        </p>
        <p>
          <span className="font-bold text-red-600">📌 KPI:</span> Average Ticket
          Resolution Time
        </p>
      </div>

      {/* Year & Quarter */}
      <div className="flex space-x-6">
        <div>
          <label className="font-semibold mr-2">Year:</label>
          <select
            className="border rounded px-2 py-1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option>2024</option>
            <option>2025</option>
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2">Quarter:</label>
          <select
            className="border rounded px-2 py-1"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <option>Q1</option>
            <option>Q2</option>
            <option>Q3</option>
            <option>Q4</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Indicator</th>
              <th className="p-2 border">Target Value</th>
              <th className="p-2 border">Justification</th>
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Attachment</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.indicator}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={row.target}
                    onChange={(e) =>
                      handleInputChange(idx, "target", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    placeholder="Justification"
                    value={row.justification}
                    onChange={(e) =>
                      handleInputChange(idx, "justification", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={(e) =>
                      handleInputChange(idx, "selected", e.target.checked)
                    }
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(idx, e.target.files[0])}
                    className="w-full"
                  />
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleSave(idx)}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceUI;
