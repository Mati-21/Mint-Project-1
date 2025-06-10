import InfoNavigation from "../InfoNavigation";
import KpiGaugeChart from "./KpiGaugeChart";
import KPIProgressTable from "./KPIProgressTable";
import PerformancePieChart from "./PerformancePieChart";
import StrategicGoalsDiagram from "./StrategicGoalsDiagram";

function Dashboard() {
  return (
    <div className="flex flex-col w-6xl mx-auto justify-center items-center">
      <div>
        <InfoNavigation />
      </div>
      <div className="flex w-full mx-auto justify-around items-center mb-10">
        <PerformancePieChart />
        <KpiGaugeChart value={56} />
      </div>
      <div className="flex w-full gap-4 mx-auto justify-center mb-10">
        <StrategicGoalsDiagram />
        <KPIProgressTable />
      </div>
    </div>
  );
}

export default Dashboard;
