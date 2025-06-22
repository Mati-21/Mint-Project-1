import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:1221";

function RatioModal({ modalInfo, closeModal }) {
  const [target, setTarget] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { kpiName, field, kraId, userId, role, sectorId, subsectorId, year, quarter } = modalInfo;

  // Determine the period string for display
  const period = quarter ? `${quarter} ${year}` : year;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Fetch target
        const targetParams = {
          kpiName,
          kraId,
          userId,
          role,
          sectorId,
          subsectorId,
          year,
        };
        if (quarter) targetParams.quarter = quarter;

        const targetRes = await axios.get(`${BASE_URL}/api/plans/target`, { params: targetParams });
        setTarget(targetRes.data?.target ?? null);

        // Fetch performance
        const perfParams = {
          kpiName,
          kraId,
          userId,
          role,
          sectorId,
          subsectorId,
          year,
        };
        if (quarter) perfParams.quarter = quarter;

        const perfRes = await axios.get(`${BASE_URL}/api/performance/measure`, { params: perfParams });
        setPerformance(perfRes.data?.performanceMeasure ?? null);
      } catch (err) {
        setError("Failed to fetch target or performance.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [kpiName, kraId, userId, role, sectorId, subsectorId, year, quarter]);

  let ratio = "N/A";
  if (
    target !== null &&
    performance !== null &&
    !isNaN(target) &&
    !isNaN(performance) &&
    Number(target) !== 0
  ) {
    ratio = ((Number(performance) / Number(target)) * 100).toFixed(2) + "%";
  }

  if (!modalInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <h2 className="text-lg font-bold mb-4 text-center">Performance-to-Target Ratio</h2>

        {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}
        {error && (
          <p className="text-center text-red-600 mb-4 font-semibold">{error}</p>
        )}

        {!loading && !error && (
          <>
            <p className="text-sm mb-2">
              KPI: <span className="font-medium">{kpiName}</span>
            </p>
            <p className="text-sm mb-2">
              Period: <span className="font-medium">{period}</span>
            </p>
            <p className="text-sm mb-2">
              Target: <span className="font-medium">{target ?? "N/A"}</span>
            </p>
            <p className="text-sm mb-2">
              Performance: <span className="font-medium">{performance ?? "N/A"}</span>
            </p>
            <p className="text-xl font-semibold mt-4 text-center text-indigo-600">
              {ratio}
            </p>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={closeModal}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatioModal;
