import React, { useState } from "react";
import CustomFilter from "../StrategicComponents/CustomFilter";

const TargetValidation = () => {
  const initialData = [
    { indicator: "KPI 1", value: "50.0 / 30.0", validated: false, comment: "" },
    { indicator: "KPI 2", value: "50.0 / 38.0", validated: false, comment: "" },
    { indicator: "KPI 3", value: "23.0 / 24.0", validated: false, comment: "" },
    {
      indicator: "KPI 4",
      value: "7082.0 / 6964.0",
      validated: false,
      comment: "",
    },
    { indicator: "KPI 5", value: "1023.0", validated: false, comment: "" },
  ];

  const [kpiData, setKpiData] = useState(initialData);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (index) => {
    const updated = [...kpiData];
    updated[index].validated = !updated[index].validated;
    setKpiData(updated);

    // Update the "Select All" checkbox status
    const allSelected = updated.every((item) => item.validated);
    setSelectAll(allSelected);
  };

  const handleCommentChange = (index, value) => {
    const updated = [...kpiData];
    updated[index].comment = value;
    setKpiData(updated);
  };

  const handleSelectAllChange = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    const updated = kpiData.map((item) => ({
      ...item,
      validated: newValue,
    }));
    setKpiData(updated);
  };

  const submitValidation = () => {
    const validated = kpiData
      .filter((item) => item.validated)
      .map(({ indicator, comment }) => ({ indicator, comment }));

    console.log("Validated Results:", validated);
    alert("Validation submitted! Check console for details.");
  };

  return (
    <div className="p-5 font-sans">
      <CustomFilter />

      <table className="w-full border border-collapse mt-6 shadow-2xl">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Indicator</th>
            <th className="border p-3 text-left">Value</th>
            <th className="border p-3 text-left">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  className="h-5 w-5"
                />
                Validate
              </div>
            </th>
            <th className="border p-3 text-left">Validation Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-green-600 text-white font-bold">
            <td colSpan="4" className="p-3">
              Goal
            </td>
          </tr>
          <tr className="bg-green-100 font-semibold">
            <td colSpan="4" className="p-3">
              KRA
            </td>
          </tr>

          {kpiData.map((item, index) => (
            <tr key={index}>
              <td className="border p-3">{item.indicator}</td>
              <td className="border p-3">{item.value}</td>
              <td className="border p-3">
                <input
                  type="checkbox"
                  checked={item.validated}
                  onChange={() => handleCheckboxChange(index)}
                  className="h-5 w-5"
                />
              </td>
              <td className="border p-3">
                <input
                  type="text"
                  placeholder="Enter comment..."
                  value={item.comment}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={submitValidation}
        className="mt-6 shadow-2xl cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
      >
        Validate Selected
      </button>
    </div>
  );
};

export default TargetValidation;
