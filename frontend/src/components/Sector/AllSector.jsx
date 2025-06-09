import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { transformAssignedKpisToNested } from "../../utils/transformAssignedKpisToNested";
import KPIGroupedTable from "../Table/KPIGroupedTable";

const BACKEND_PORT = 1221;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

function AllSector() {
  const { sectorId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [assignedKpisRaw, setAssignedKpisRaw] = useState(null);
  const [nestedKpis, setNestedKpis] = useState([]);
  const [detailedKpis, setDetailedKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectorId) {
      setNestedKpis([]);
      setDetailedKpis([]);
      setError(null);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch assigned KPIs by sector ID
        const assignedRes = await fetch(`${BACKEND_URL}/api/assign/sector/${sectorId}`, {
          headers: { Accept: "application/json" },
        });

        if (!assignedRes.ok) {
          throw new Error(`Assigned KPIs fetch failed with status: ${assignedRes.status}`);
        }

        const assignedData = await assignedRes.json();
        setAssignedKpisRaw(assignedData);

        // Transform assigned KPIs for UI
        const nested = transformAssignedKpisToNested(assignedData);
        setNestedKpis(nested);

        // Extract KPI IDs
        const kpiIds = assignedData
          .map(item => item.kpi_id || (item.kpi && item.kpi.kpi_id))
          .filter(Boolean);

        if (kpiIds.length === 0) {
          setDetailedKpis([]);
        } else {
          const queryParam = kpiIds.join(",");
          const detailedRes = await fetch(`${BACKEND_URL}/api/assign/details?ids=${queryParam}`, {
            headers: { Accept: "application/json" },
          });

          if (!detailedRes.ok) {
            console.warn("Failed to fetch detailed KPIs, status:", detailedRes.status);
            setDetailedKpis([]);
          } else {
            const detailedData = await detailedRes.json();
            setDetailedKpis(detailedData);
          }
        }
      } catch (err) {
        console.error("Error fetching KPI data:", err);
        setNestedKpis([]);
        setDetailedKpis([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sectorId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Assigned KPIs for Sector: {sectorId || "(no sector ID)"}
      </h2>

      <p className="text-sm mb-2 text-gray-600">User ID: {userId}</p>

      {loading && <p>Loading assigned KPIs...</p>}

      {error && <p className="text-red-600">Error loading KPIs: {error}</p>}

      {!loading && !error && nestedKpis.length === 0 && (
        <p>No KPIs assigned or failed to load.</p>
      )}

      {!loading && !error && nestedKpis.length > 0 && (
        <KPIGroupedTable data={nestedKpis} detailedKpis={detailedKpis} />
      )}
    </div>
  );
}

export default AllSector;
