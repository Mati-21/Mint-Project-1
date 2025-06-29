import { useState } from "react";

import AddMeasure from "./AddMeasure";
import AssignTarget from "./AssignTarget";
import PerformanceTable from "./PerformanceTable";

export default function TaskAssignment() {
  const [kpis, setKpis] = useState({});
  const [assignments, setAssignments] = useState(
    () => JSON.parse(localStorage.getItem("assignments")) || []
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      {/* 3-column grid for top section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddMeasure />
        <AssignTarget
          kpis={kpis}
          assignments={assignments}
          setAssignments={setAssignments}
        />
      </div>

      {/* Full-width performance table */}
      <PerformanceTable assignments={assignments} />
    </div>
  );
}
