import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { transformAssignedKpisToNested } from "../../utils/transformAssignedKpisToNested";
import KPIGroupedTable from "../Table/KPIGroupedTable";
import useAuthStore from "../../store/auth.store";

const BACKEND_PORT = 1221;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

function AllSubsector() {
  const { subsectorId } = useParams();
  const { user } = useAuthStore();

  const [assignedKpisRaw, setAssignedKpisRaw] = useState(null);
  const [nestedKpis, setNestedKpis] = useState([]);
  const [detailedKpis, setDetailedKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if user and subsectorId are available
    if (!user || !subsectorId) {
      setNestedKpis([]);
      setDetailedKpis([]);
      setError(null);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch assigned KPIs with goal details for the subsector
        const assignedRes = await fetch(
          `${BACKEND_URL}/api/assign/assigned-kpi-with-goal-details/${subsectorId}`,
          { headers: { Accept: "application/json" } }
        );

        if (!assignedRes.ok) {
          throw new Error(`Assigned KPIs fetch failed with status: ${assignedRes.status}`);
        }

        const assignedContentType = assignedRes.headers.get("content-type");
        if (!assignedContentType || !assignedContentType.includes("application/json")) {
          throw new Error("Assigned KPIs response is not JSON");
        }

        const assignedData = await assignedRes.json();
        setAssignedKpisRaw(assignedData);

        const nested = transformAssignedKpisToNested(assignedData);
        setNestedKpis(nested);

        // Fetch detailed KPIs for subsector
        const detailedRes = await fetch(
          `${BACKEND_URL}/api/assign/details/by-subsector/${subsectorId}`,
          { headers: { Accept: "application/json" } }
        );

        if (!detailedRes.ok) {
          console.warn("Failed to fetch detailed KPIs, status:", detailedRes.status);
          setDetailedKpis([]);
        } else {
          const detailedContentType = detailedRes.headers.get("content-type");
          if (!detailedContentType || !detailedContentType.includes("application/json")) {
            console.warn("Detailed KPIs response is not JSON");
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
  }, [user, subsectorId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Assigned KPIs for Subsector: {subsectorId || "(no subsector ID)"}
      </h2>

      {loading && <p>Loading assigned KPIs...</p>}

      {error && <p className="text-red-600">Error loading KPIs: {error}</p>}

      {!loading && !error && nestedKpis.length === 0 && <p>No KPIs assigned or failed to load.</p>}

      {!loading && !error && nestedKpis.length > 0 && (
        <KPIGroupedTable data={nestedKpis} detailedKpis={detailedKpis} />
      )}
    </div>
  );
}

export default AllSubsector;
