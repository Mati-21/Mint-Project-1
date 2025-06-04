import { useEffect, useState } from "react";
import KPIGroupedTable from "../Table/KPIGroupedTable";
import { useParams } from "react-router-dom";

function AllSector() {
  const { sector } = useParams();
  const backendUrl = `http://localhost:1221/api/assign/assigned-kpi/${sector}`;
  const [data, setData] = useState([]);
  const [detailedKpis, setDetailedKpis] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Step 1: Fetch assigned KPI structure
        const res = await fetch(backendUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const result = await res.json();
        const assignedData = result.data || [];
        setData(assignedData);

        // Step 2: Extract KPI IDs
        const kpiIds = [];
        assignedData.forEach((goal) => {
          goal.kras?.forEach((kra) => {
            kra.kpis?.forEach((kpi) => {
              if (kpi?._id) {
                kpiIds.push(kpi._id);
              }
            });
          });
        });

        // Step 3: Fetch detailed KPI info
        if (kpiIds.length > 0) {
          const idsParam = kpiIds.join(",");
          const kpiRes = await fetch(
            `http://localhost:1221/api/kpi/details?ids=${idsParam}`
          );

          if (!kpiRes.ok) {
            throw new Error("Failed to fetch KPI details.");
          }

          const kpiResult = await kpiRes.json();
          setDetailedKpis(kpiResult.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load KPI data. Please try again later.");
      }
    }

    fetchData();
  }, [backendUrl]);

  return (
    <div className="p-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <KPIGroupedTable data={data} detailedKpis={detailedKpis} />
      )}
    </div>
  );
}

export default AllSector;
