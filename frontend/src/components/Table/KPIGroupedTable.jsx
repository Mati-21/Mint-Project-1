import React, { useState } from "react";
import KPITable from "./KPITable";
import Filters from "./Filters"; // your filter inputs component
import PlanModal from "./PlanModal"; // modal for editing plan
import PerformanceModal from "./PerformanceModal"; // modal for editing KPI performance

function KPIGroupedTable({ data, detailedKpis }) {
  const [filterYear, setFilterYear] = useState("");
  const [filterGoal, setFilterGoal] = useState("");
  const [filterKra, setFilterKra] = useState("");
  const [filterKpiName, setFilterKpiName] = useState("");

  // Modal states
  const [planModalInfo, setPlanModalInfo] = useState(null);
  const [performanceModalInfo, setPerformanceModalInfo] = useState(null);

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // Flatten nested data for display & filtering
  const normalizedData = [];

  data.forEach((goal) => {
    const goalName = goal.goal_desc || "N/A";
    goal.kras?.forEach((kra) => {
      const kraName = kra.kra_name || "N/A";
      kra.kpis?.forEach((kpi) => {
        const kpiDetail = detailedKpis.find((d) => d._id === kpi._id) || {};
        normalizedData.push({
          kpiId: kpi._id,
          kpiName: kpiDetail.kpi_name || kpi.kpi_name || "N/A",
          year: kpiDetail.year || "N/A",
          q1: kpiDetail.q1 || "N/A",
          q2: kpiDetail.q2 || "N/A",
          q3: kpiDetail.q3 || "N/A",
          q4: kpiDetail.q4 || "N/A",
          target: kpiDetail.target || "", // for modal
          performanceMeasure: kpiDetail.performanceMeasure || "", // for modal
          description: kpiDetail.description || "", // for modal
          kra: kraName,
          goal: goalName,
        });
      });
    });
  });

  // Filtering
  const filteredData = normalizedData.filter((row) => {
    const goal = row.goal?.toLowerCase() || "";
    const kra = row.kra?.toLowerCase() || "";
    const kpiName = row.kpiName?.toLowerCase() || "";
    const yearStr = row.year?.toString() || "";

    return (
      (!filterYear || yearStr.includes(filterYear.trim())) &&
      (!filterGoal || goal.includes(filterGoal.trim().toLowerCase())) &&
      (!filterKra || kra.includes(filterKra.trim().toLowerCase())) &&
      (!filterKpiName || kpiName.includes(filterKpiName.trim().toLowerCase()))
    );
  });

  // Group by Goal and KRA
  const groupedData = {};
  filteredData.forEach((row) => {
    const groupKey = `${row.goal}||${row.kra}`;
    if (!groupedData[groupKey]) groupedData[groupKey] = [];
    groupedData[groupKey].push(row);
  });

  // Modal handlers for Plan
  const openModal = (row, field) => {
    setPlanModalInfo({ ...row, field });
  };
  const closeModal = () => setPlanModalInfo(null);
  const handlePlanFormSubmit = (formData) => {
    console.log("Plan updated:", formData);
    alert("Plan saved!");
    closeModal();
    // Add update logic here
  };

  // Modal handlers for Performance
  const openPerformanceModal = (row, field) => {
    setPerformanceModalInfo({ ...row, field });
  };
  const closePerformanceModal = () => setPerformanceModalInfo(null);
  const handlePerformanceFormSubmit = (formData) => {
    console.log("Performance updated:", formData);
    alert("Performance saved!");
    closePerformanceModal();
    // Add update logic here
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
            openPerformanceModal={openPerformanceModal}
          />
        ))
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}

      {planModalInfo && (
        <PlanModal
          modalInfo={planModalInfo}
          closeModal={closeModal}
          handleFormSubmit={handlePlanFormSubmit}
        />
      )}

      {performanceModalInfo && (
        <PerformanceModal
          PerformanceModalInfo={performanceModalInfo}
          closePerformanceModal={closePerformanceModal}
          handleFormSubmit={handlePerformanceFormSubmit}
        />
      )}
    </div>
  );
}

export default KPIGroupedTable;
