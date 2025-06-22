import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:1221";

function PlanModal({ modalInfo, closeModal, handleFormSubmit }) {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [validationStatus, setValidationStatus] = useState("Pending");

  // Parse quarter and year from period string e.g. "q1-2023" or "year-2023"
  let quarter = null;
  let year = null;
  if (modalInfo.period) {
    const parts = modalInfo.period.split("-");
    if (parts.length === 2) {
      if (parts[0].toLowerCase().startsWith("q")) {
        quarter = parts[0].toLowerCase();
        year = parts[1];
      } else {
        year = parts[1];
      }
    }
  }

  useEffect(() => {
    const fetchTarget = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          kpiName: modalInfo.kpiName || "",
          kraId:
            typeof modalInfo.kraId === "object"
              ? modalInfo.kraId._id || ""
              : modalInfo.kraId || "",
          role: modalInfo.role || "",
          sectorId:
            typeof modalInfo.sectorId === "object"
              ? modalInfo.sectorId._id || ""
              : modalInfo.sectorId || "",
          subsectorId:
            typeof modalInfo.subsectorId === "object"
              ? modalInfo.subsectorId._id || ""
              : modalInfo.subsectorId || undefined,
          userId: modalInfo.userId || "",
          year: year || "",
          quarter: quarter || undefined,
        };

        console.log("Params for /plans/target:", params);

        const res = await axios.get(`${BASE_URL}/api/plans/target`, { params });
        setTarget(res.data?.target?.toString() || "");
        setValidationStatus(
          res.data?.validationStatus ?? res.data?.validationStatusYear ?? "Pending"
        );
      } catch (err) {
        setError("Error fetching target.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarget();
  }, [modalInfo, year, quarter]);

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (loading || !!error || !!warning) return;
    if (validationStatus === "Approved") return;
    if (target === "" || isNaN(Number(target))) {
      setError("Please enter a valid target.");
      return;
    }

    handleFormSubmit({
      ...modalInfo,
      target: Number(target),
      year,
      quarter,
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <div className="absolute right-6 top-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              validationStatus === "Approved"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-yellow-100 text-yellow-700 border border-yellow-400"
            }`}
          >
            {validationStatus}
          </span>
        </div>

        <h2 className="text-lg font-bold mb-4">Edit KPI Target</h2>

        {warning && (
          <p className="mb-2 text-yellow-700 font-semibold bg-yellow-100 p-2 rounded">
            {warning}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">KPI Name</label>
            <input
              type="text"
              readOnly
              value={modalInfo.kpiName || ""}
              className="w-full border px-3 py-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold">{quarter ? "Quarter" : "Year"}</label>
            <input
              type="text"
              readOnly
              value={quarter ? `${quarter} ${year}` : year}
              className="w-full border px-3 py-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold">Target</label>
            <input
              type="number"
              min="0"
              step="any"
              value={target}
              onChange={handleTargetChange}
              className="w-full border px-3 py-1 rounded"
              required
              disabled={loading || !!warning || validationStatus === "Approved"}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1 font-semibold">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-1 rounded ${
                validationStatus === "Approved"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              disabled={loading || !!error || !!warning || validationStatus === "Approved"}
            >
              {loading ? "Loading..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanModal;
