import { useState } from "react";
import GoalForm from "./GoalForm";
import KRAForm from "./KRAForm";
import KPIForm from "./KPIForm";
import ChartDisplay from "./ChartDisplay";
import SearchInput from "./SearchInput";
import DataTable from "./DataTable";

function AddGoalKraKpi() {
  const [goals, setGoals] = useState([]);
  const [kras, setKras] = useState([]);
  const [kpis, setKpis] = useState([]);

  const [newGoal, setNewGoal] = useState("");
  const [newKra, setNewKra] = useState("");
  const [newKpi, setNewKpi] = useState("");

  const [kraGoalId, setKraGoalId] = useState("");
  const [kpiGoalId, setKpiGoalId] = useState("");
  const [kpiKraId, setKpiKraId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddGoal = () => {
    if (!newGoal) return alert("Goal name is required!");
    const newGoalObj = { id: Date.now().toString(), name: newGoal };
    setGoals([...goals, newGoalObj]);
    setNewGoal("");
  };

  const handleAddKRA = () => {
    if (!newKra || !kraGoalId)
      return alert("KRA name and Goal selection are required!");
    const newKraObj = {
      id: Date.now().toString(),
      goalId: kraGoalId,
      name: newKra,
    };
    setKras([...kras, newKraObj]);
    setNewKra("");
    setKraGoalId("");
  };

  const handleAddKPI = () => {
    if (!newKpi || !kpiGoalId || !kpiKraId)
      return alert("KPI name, Goal, and KRA selections are required!");
    const newKpiObj = {
      id: Date.now().toString(),
      goalId: kpiGoalId,
      kraId: kpiKraId,
      name: newKpi,
    };
    setKpis([...kpis, newKpiObj]);
    setNewKpi("");
    setKpiGoalId("");
    setKpiKraId("");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add Goal, KRA, KPI
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GoalForm
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          handleAddGoal={handleAddGoal}
        />
        <KRAForm
          goals={goals}
          kraGoalId={kraGoalId}
          setKraGoalId={setKraGoalId}
          newKra={newKra}
          setNewKra={setNewKra}
          handleAddKRA={handleAddKRA}
        />
        <KPIForm
          goals={goals}
          kras={kras}
          kpiGoalId={kpiGoalId}
          setKpiGoalId={setKpiGoalId}
          kpiKraId={kpiKraId}
          setKpiKraId={setKpiKraId}
          newKpi={newKpi}
          setNewKpi={setNewKpi}
          handleAddKPI={handleAddKPI}
        />
      </div>

      <div className="mt-10 h-94  flex justify-center items-center">
        <ChartDisplay goals={goals} kras={kras} kpis={kpis} />
      </div>

      <div className="mt-6">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DataTable
          goals={goals}
          kras={kras}
          kpis={kpis}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default AddGoalKraKpi;
