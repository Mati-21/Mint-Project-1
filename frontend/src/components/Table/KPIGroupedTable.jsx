import React, { useState } from "react";
import Filters from "./Filters";
import KPITable from "./KPITable";
import PlanModal from "./PlanModal";

function KPIGroupedTable({ data }) {
  const [filterYear, setFilterYear] = useState("");
  const [filterGoal, setFilterGoal] = useState("");
  const [filterKra, setFilterKra] = useState("");
  const [filterKpiName, setFilterKpiName] = useState("");
  const [modalInfo, setModalInfo] = useState(null);

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // ✅ Flatten nested data: goal -> kras -> kpis
  const normalizedData = data.flatMap((goalItem) => {
    const goalDesc = goalItem.goal_desc;
    const kras = goalItem.kras || [];

    return kras.flatMap((kraItem) => {
      const kraName = kraItem.kra_name;
      const kpis = kraItem.kpis || [];

      return kpis.map((kpi) => ({
        kpiName: kpi.kpi_name,
        year: kpi.year,
        q1: kpi.q1,
        q2: kpi.q2,
        q3: kpi.q3,
        q4: kpi.q4,
        kra: kraName,
        goal: goalDesc,
      }));
    });
  });

  // ✅ Apply filters
  const filteredData = normalizedData.filter((row) => {
    const goal = row.goal?.toLowerCase() || "";
    const kra = row.kra?.toLowerCase() || "";
    const kpiName = row.kpiName?.toLowerCase() || "";

    return (
      (!filterYear || row.year?.toString().includes(filterYear.trim())) &&
      (!filterGoal || goal.includes(filterGoal.trim().toLowerCase())) &&
      (!filterKra || kra.includes(filterKra.trim().toLowerCase())) &&
      (!filterKpiName || kpiName.includes(filterKpiName.trim().toLowerCase()))
    );
  });

  // ✅ Group by Goal and KRA
  const groupedData = {};
  filteredData.forEach((row) => {
    const groupKey = `${row.goal}||${row.kra}`;
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = [];
    }
    groupedData[groupKey].push(row);
  });

  // ✅ Modal open
  const openModal = (row, field) => {
    setModalInfo({ row, field, value: row[field] });
  };

  const closeModal = () => setModalInfo(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Plan saved!");
    closeModal();
  };

  return (
    <div className="p-4 overflow-x-auto">
      <Filters
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        filterGoal={filterGoal}
        setFilterGoal={setFilterGoal}
        filterKra={filterKra}
        setFilterKra={setFilterKra}
        filterKpiName={filterKpiName}
        setFilterKpiName={setFilterKpiName}
      />

      {Object.keys(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([groupKey, rows], idx) => (
          <KPITable
            key={idx}
            groupKey={groupKey}
            rows={rows}
            openModal={openModal}
          />
        ))
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}

      {modalInfo && (
        <PlanModal
          modalInfo={modalInfo}
          closeModal={closeModal}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default KPIGroupedTable;