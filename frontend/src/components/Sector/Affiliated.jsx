import { useEffect, useState } from "react";
import KPIGroupedTable from "../Table/KPIGroupedTable";

function Affiliated() {
  const [data, setData] = useState([]);
  const Endpoint = "http://localhost:5000/kpis";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(Endpoint);
      const data = await res.json();
      setData(data);
    }
    fetchData();
  }, []);

  console.log(data);

  return (
    <div>
      <KPIGroupedTable data={data} />
    </div>
  );
}

export default Affiliated;
