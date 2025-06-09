import { useState, useEffect } from "react";

function PerformanceModal({ PerformanceModalInfo, closePerformanceModal, handleFormSubmit }) {
  const [formData, setFormData] = useState({
    kpiName: "",
    quarter: null,
    year: "",
    target: "",
    performanceMeasure: "",
    description: "",
  });

  useEffect(() => {
    if (PerformanceModalInfo) {
      let quarter = null;
      let year = "";

      // parse period like 'year-2017' or 'q1-2017'
      if (PerformanceModalInfo.period) {
        const parts = PerformanceModalInfo.period.split("-");
        if (parts.length === 2) {
          if (parts[0].startsWith("q")) {
            quarter = parts[0].toUpperCase(); // Q1, Q2, etc
            year = parts[1];
          } else if (parts[0] === "year") {
            year = parts[1];
          }
        }
      }

      setFormData({
        kpiName: PerformanceModalInfo.kpiName || "",
        quarter,
        year,
        target: PerformanceModalInfo.target || "",
        performanceMeasure: PerformanceModalInfo.performanceMeasure || "",
        description: PerformanceModalInfo.description || "",
      });
    }
  }, [PerformanceModalInfo]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Edit KPI</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">KPI Name</label>
            <input
              name="kpiName"
              type="text"
              value={formData.kpiName}
              onChange={onChange}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">{formData.quarter ? "Quarter" : "Year"}</label>
            <input
              type="text"
              readOnly
              value={formData.quarter ? `${formData.quarter} ${formData.year}` : formData.year}
              className="w-full border px-3 py-1 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold">Target</label>
            <input
              name="target"
              type="text"
              value={formData.target}
              onChange={onChange}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Performance Measure</label>
            <input
              name="performanceMeasure"
              type="text"
              value={formData.performanceMeasure}
              onChange={onChange}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closePerformanceModal}
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerformanceModal;
