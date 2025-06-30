import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthStore from "../../../store/auth.store";
import { taskAssignStore } from "../../../store/taskAssignStore";

const BACKEND_URL = `http://localhost:1221`;

const PlanningUI = () => {
  const [year, setYear] = useState("2024");
  const [quarter, setQuarter] = useState("Q1");
  const [AssignedMeasure, setAssignedMeasure] = useState([]);
  const { user } = useAuthStore();
  const { fetchAssignedTask } = taskAssignStore();

  const userId = user?._id;

  useEffect(() => {
    const AssigneMeasure = async () => {
      const res = await fetchAssignedTask(userId);

      setAssignedMeasure(res);
    };
    AssigneMeasure();
  }, [fetchAssignedTask, userId]);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-orange-600">Planning</h2>
        {/* Year & Quarter Selectors */}
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

        {AssignedMeasure?.length > 0 ? (
          AssignedMeasure.map((assignment, index) => (
            <div
              key={assignment._id || index}
              className="border-t pt-6 space-y-4"
            >
              {/* Goal, KRA, KPI */}
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-pink-600">🎯 Goal:</span>{" "}
                  {assignment?.Goal_Name || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-yellow-600">🏷️ KRA:</span>{" "}
                  {assignment?.Kra_Name || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-red-600">📌 KPI:</span>{" "}
                  {assignment?.Kpi_Name || "N/A"}
                </p>
              </div>

              {/* Indicator Table */}
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full table-fixed">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 border font-semibold">
                        Indicator
                      </th>
                      <th className="text-left p-3 border font-semibold">
                        Target Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignment.measures?.map((measure, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-3 border">{measure.measure}</td>
                        <td className="p-3 border">
                          <input
                            type="text"
                            defaultValue={measure.target}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default PlanningUI;
