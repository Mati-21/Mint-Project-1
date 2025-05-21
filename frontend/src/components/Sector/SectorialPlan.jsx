import { useEffect, useState } from "react";
import KPIGroupedTable from "../Table/KPIGroupedTable";

function SectorialPlan() {
  const [ictData, setIctData] = useState([]);
  const [innovationData, setInnovationData] = useState([]);

  const InnovationEndpoint = "http://localhost:5002/kpis";
  const IctEndpoint = "http://localhost:5001/kpis";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(InnovationEndpoint);
      const res1 = await fetch(IctEndpoint);
      const data = await res.json();
      const data1 = await res1.json();
      setIctData(data1);
      setInnovationData(data);
    }
    fetchData();
  }, []);

  const finalData = [...innovationData, ...ictData];

  return (
    <div>
      <KPIGroupedTable data={finalData} />
    </div>
  );
}

export default SectorialPlan;
