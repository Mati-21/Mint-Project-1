import { useEffect, useState } from "react";
import KPIGroupedTable from "../Table/KPIGroupedTable";

const backendUrl = "http://localhost:1221/api/kpis2/get-kpi2";

function Ict() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(backendUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        const combinedData = result.data;

        setData(combinedData);
      } catch (err) {
        console.error("Error fetching KPI data:", err);
        setError("Failed to load KPI data. Please try again later.");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="p-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <KPIGroupedTable data={data} />
      )}
    </div>
  );
}
export default Ict;
