import { useEffect, useState } from "react";
import KPIGroupedTable from "../Table/KPIGroupedTable";

function SectorialPlan() {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Adjust endpoint if needed
  const KPI_ENDPOINT = "http://localhost:1221/api/kpis2/all2"; 

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await fetch(KPI_ENDPOINT);

        if (!response.ok) {
          throw new Error("Failed to fetch KPIs");
        }

        const data = await response.json();
        setKpiData(data);
      } catch (err) {
        console.error("Error fetching KPI data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) return <div className="text-white p-4">Loading KPIs...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div>
      <KPIGroupedTable data={kpiData} />
    </div>
  );
}

export default SectorialPlan;
