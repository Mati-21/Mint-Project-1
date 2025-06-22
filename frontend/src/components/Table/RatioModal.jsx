import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:1221";

function RatioModal({ modalInfo, closeModal }) {
  const [target, setTarget] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!modalInfo) return null;

  // Parse quarter and year from modalInfo.field
  let quarter = null;
  let year = null;
  if (modalInfo.field) {
    const parts = modalInfo.field.split("-");
    if (parts.length === 2) {
      if (parts[0].toLowerCase().startsWith("q")) {
        quarter = parts[0].toUpperCase();
        year = parts[1];
      } else if (parts[0].toLowerCase() === "year") {
        year = parts[1];
      }
    }
  }

  const period = quarter ? `${quarter} ${year}` : `Year ${year}`;

  const isValidNumber = (val) =>
    val !== null &&
    val !== undefined &&
    val !== "" &&
    val !== "N/A" &&
    !isNaN(Number(val));

  useEffect(() => {
    if (isValidNumber(modalInfo.target) && isValidNumber(modalInfo.performance)) {
      setTarget(Number(modalInfo.target));
      setPerformance(Number(modalInfo.performance));
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const params = {
          kpiName: modalInfo.kpiName,
          kraId: modalInfo.kraId,
          role: modalInfo.role,
          userId: modalInfo.userId,
          sectorId: modalInfo.sectorId,
          subsectorId: modalInfo.subsectorId,
          year,
        };
        if (quarter) params.quarter = quarter;

        const planRes = await axios.get(`${BASE_URL}/api/plans/target`, { params });
        const perfRes = await axios.get(`${BASE_URL}/api/performance/measure`, { params });

        const fetchedTarget = planRes.data?.target ?? null;
        const fetchedPerformance = perfRes.data?.performanceMeasure ?? null;

        setTarget(isValidNumber(fetchedTarget) ? Number(fetchedTarget) : null);
        setPerformance(isValidNumber(fetchedPerformance) ? Number(fetchedPerformance) : null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch target or performance.");
        setTarget(null);
        setPerformance(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [modalInfo, quarter, year]);

  let ratio = "N/A";
  if (
    isValidNumber(target) &&
    isValidNumber(performance) &&
    Number(target) !== 0
  ) {
    ratio = ((performance / target) * 100).toFixed(2) + "%";
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <h2 className="text-lg font-bold mb-4">Performance-to-Target Ratio</h2>

        {loading ? (
          <p className="text-center text-gray-600 mb-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 mb-4 font-semibold">{error}</p>
        ) : (
          <>
            <div className="mb-4 space-y-2">
              <div>
                <label className="block font-semibold text-gray-700">KPI</label>
                <input
                  type="text"
                  readOnly
                  value={modalInfo.kpiName}
                  className="w-full border rounded px-3 py-1 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Period</label>
                <input
                  type="text"
                  readOnly
                  value={period}
                  className="w-full border rounded px-3 py-1 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Target</label>
                <input
                  type="text"
                  readOnly
                  value={target !== null ? target : "N/A"}
                  className="w-full border rounded px-3 py-1 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Performance</label>
                <input
                  type="text"
                  readOnly
                  value={performance !== null ? performance : "N/A"}
                  className="w-full border rounded px-3 py-1 bg-gray-100"
                />
              </div>
            </div>

            <p className="text-xl font-semibold text-green-600 text-center">{ratio}</p>
          </>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-1 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatioModal;
