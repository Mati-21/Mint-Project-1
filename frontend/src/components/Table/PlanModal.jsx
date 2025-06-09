import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:1221";

function PlanModal({ modalInfo, closeModal, handleFormSubmit }) {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  let quarter = null;
  let year = null;

  // Parse period string like "q1-2023" or "year-2023"
  if (modalInfo.period) {
    const parts = modalInfo.period.split("-");
    if (parts.length === 2) {
      if (parts[0].toLowerCase().startsWith("q")) {
        quarter = parts[0].toUpperCase();
        year = parts[1];
      } else if (parts[0].toLowerCase() === "year") {
        year = parts[1];
      }
    }
  }

  useEffect(() => {
    console.log("useEffect triggered with modalInfo:", modalInfo);
    console.log("Parsed quarter:", quarter, "year:", year);

    async function fetchTarget() {
      if (
        !modalInfo.kpiName ||
        !modalInfo.kraId ||
        !modalInfo.role ||
        !modalInfo.userId ||
        !year
      ) {
        console.log("fetchTarget early return due to missing params");
        setWarning(
          "Missing required data to fetch target: " +
            [
              !modalInfo.kpiName && "kpiName",
              !modalInfo.kraId && "kraId",
              !modalInfo.role && "role",
              !modalInfo.userId && "userId",
              !year && "year",
            ]
              .filter(Boolean)
              .join(", ")
        );
        setTarget("");
        return;
      }

      setWarning("");
      setLoading(true);

      try {
        const params = {
          kpiName: modalInfo.kpiName,
          kraId: modalInfo.kraId,
          role: modalInfo.role,
          sectorId: modalInfo.sectorId,
          subsectorId: modalInfo.subsectorId,
          userId: modalInfo.userId,
          year,
        };
        if (quarter) {
          params.quarter = quarter;
        }

        console.log("Fetching target with params:", params);

         const res = await axios.get(`${BASE_URL}/api/plans/target`, { params });

        console.log("Fetched target response:", res.data);


        setTarget(res.data?.target?.toString() || "");
        setError("");
      } catch (err) {
        console.error("Error fetching target:", err);
        setTarget("");
        setError("Could not fetch target for this period.");
      } finally {
        setLoading(false);
      }
    }

    fetchTarget();
  }, [modalInfo, year, quarter]);

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    setError(""); // Reset error on input change
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (target === "" || isNaN(target)) {
      alert("Please enter a valid target.");
      return;
    }

    const data = {
      ...modalInfo,
      year,
      quarter,
      target: parseFloat(target),
    };

    handleFormSubmit(data);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
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
              disabled={loading || !!warning}
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
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              disabled={loading || !!error || !!warning}
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
