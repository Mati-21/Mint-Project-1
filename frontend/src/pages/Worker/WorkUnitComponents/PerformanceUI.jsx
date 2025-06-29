import React, { useEffect, useState } from "react";
import useAuthStore from "../../../store/auth.store";
import axios from "axios";

const PerformanceUI = () => {
  const [year, setYear] = useState("2024");
  const [quarter, setQuarter] = useState("Q1");
  const [assignedMeasure, setAssignedMeasure] = useState([]);

  const { user } = useAuthStore();
  const userId = user?._id;

  useEffect(() => {
    const fetchAssignedMeasures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1221/api/measureAssignment/user/${userId}`
        );
        const withExtras = res.data.map((item) => ({
          ...item,
          justification: "",
          selected: false,
          file: null,
        }));
        setAssignedMeasure(withExtras);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };
    if (userId) fetchAssignedMeasures();
  }, [userId]);

  const handleInputChange = (index, field, value) => {
    const updated = [...assignedMeasure];
    updated[index][field] = value;
    setAssignedMeasure(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...assignedMeasure];
    updated[index].file = file;
    setAssignedMeasure(updated);
  };

  const handleSave = (index) => {
    const item = assignedMeasure[index];
    console.log("Saving:", item);
    alert(`Saved: ${item.indicator}`);
    // Replace with API POST/PUT if needed
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">Performance</h2>

      {/* Year & Quarter Selection */}
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

      {/* Render filtered assigned measures */}
      {assignedMeasure.map((item, idx) => (
        <div key={idx} className="space-y-4 mb-10">
          {/* Goal / KRA / KPI Section */}
          <div className="space-y-2">
            <p>
              <span className="font-bold text-pink-600">🎯 Goal:</span>{" "}
              {item.Goal_Name || "N/A"}
            </p>
            <p>
              <span className="font-bold text-yellow-600">🏷️ KRA:</span>{" "}
              {item.Kra_Name || "N/A"}
            </p>
            <p>
              <span className="font-bold text-red-600">📌 KPI:</span>{" "}
              {item.Kpi_Name || "N/A"}
            </p>
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
                {item.measures.map((data, idx) => (
                  <tr>
                    <td className="p-2 border">{data.measure}</td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={data.target}
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
                        value={data.justification}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "justification",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={data.selected}
                        onChange={(e) =>
                          handleInputChange(idx, "selected", e.target.checked)
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(idx, e.target.files[0])
                        }
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
      ))}
    </div>
  );
};

export default PerformanceUI;
