import React, { useState } from "react";
import KPITable from "./KPITable";
import Filters from "./Filters"; // your filter inputs component
import PlanModal from "./PlanModal"; // modal for editing plan
import PerformanceModal from "./PerformanceModal"; // modal for editing KPI performance

const BACKEND_URL = "http://localhost:1221";

function getCurrentEthiopianYear() {
  const today = new Date();
  const gYear = today.getFullYear();
  const gMonth = today.getMonth() + 1; // 1-based month
  const gDate = today.getDate();

  const isLeapYear =
    (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;

  const newYearDay = isLeapYear ? 12 : 11;

  const ethiopianYear =
    gMonth < 9 || (gMonth === 9 && gDate < newYearDay) ? gYear - 8 : gYear - 7;

  return ethiopianYear;
}

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

  const currentEthYear = getCurrentEthiopianYear();

  // Flatten nested data for display & filtering
  const normalizedData = [];

  data.forEach((goal) => {
    const goalName = goal.goal_desc || "N/A";
    goal.kras?.forEach((kra) => {
      const kraName = kra.kra_name || "N/A";
      kra.kpis?.forEach((kpi) => {
        // Find detailed KPI info by matching _id
        const kpiDetail = detailedKpis.find((d) => d._id === kpi._id) || {};

        normalizedData.push({
          kpiId: kpiDetail.kpiId || kpi.kpiId || kpi._id || null,
          kpiName: kpiDetail.kpi_name || kpi.kpi_name || "N/A",
          kraId: kpiDetail.kraId || kra.kra_id || kra._id || null,
          sectorId: kpiDetail.sectorId || null, // Add these if available in your data
          subsectorId: kpiDetail.subsectorId || null,
          year: kpiDetail.year || currentEthYear,
          q1: kpiDetail.q1 || "N/A",
          q2: kpiDetail.q2 || "N/A",
          q3: kpiDetail.q3 || "N/A",
          q4: kpiDetail.q4 || "N/A",
          target: kpiDetail.target || "",
          performanceMeasure: kpiDetail.performanceMeasure || "",
          description: kpiDetail.description || "",
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
    // Read user info from localStorage (stored after login)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id || null;
    const role = user.role || null;
    const sectorId = user.sectorId || user.sector || null;
    const subsectorId = user.subsectorId || user.subsector || null;

    if (!userId || !role) {
      alert("User info missing: Please log in again.");
      return;
    }

    // Pass user info along with KPI row info to PlanModal
    setPlanModalInfo({
      ...row,
      field,
      userId,
      role,
      sectorId,
      subsectorId,
    });
  };
  const closeModal = () => setPlanModalInfo(null);

  // Async submit to backend for Plan
  const handlePlanFormSubmit = async (formData) => {
    try {
      const {
        userId,
        role,
        sectorId,
        subsectorId,
        kpiName,
        kraId,
        kpiId,
        year,
        q1,
        q2,
        q3,
        q4,
        target,
        performanceMeasure,
        description,
        goal,
        period,
        quarter,
      } = formData;

      if (!userId || !role) {
        throw new Error(
          "User info missing: Please log in again to submit the plan."
        );
      }

      const body = {
        userId,
        role,
        sectorId,
        subsectorId,
        kpi_name: kpiName,
        kraId,
        kpiId,
        year: Number(year) || getCurrentEthiopianYear(),
        q1: q1 === "N/A" ? null : q1,
        q2: q2 === "N/A" ? null : q2,
        q3: q3 === "N/A" ? null : q3,
        q4: q4 === "N/A" ? null : q4,
        target: target || null,
        performanceMeasure: performanceMeasure || null,
        description: description || null,
        goal: goal || null,
        period: period || null,
        quarter: quarter || null,
      };

      // Remove null or empty fields
      Object.keys(body).forEach((key) => {
        if (
          body[key] === null ||
          body[key] === undefined ||
          body[key] === ""
        ) {
          delete body[key];
        }
      });

      const response = await fetch(`${BACKEND_URL}/api/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Plan saved response:", result);
      alert("Plan saved!");
      closeModal();
    } catch (error) {
      console.error("Failed to save plan:", error);
      alert("Failed to save plan: " + error.message);
    }
  };

  // Modal handlers for Performance
  const openPerformanceModal = (row, field) => {
    setPerformanceModalInfo({ ...row, field });
  };
  const closePerformanceModal = () => setPerformanceModalInfo(null);

  // Async submit to backend for Performance
  const handlePerformanceFormSubmit = async (formData) => {
    try {
      console.log("Submitting performance data to backend:", formData);

      const response = await fetch(`${BACKEND_URL}/api/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Performance saved response:", result);
      alert("Performance saved!");
      closePerformanceModal();
    } catch (error) {
      console.error("Failed to save performance:", error);
      alert("Failed to save performance: " + error.message);
    }
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
            currentEthYear={currentEthYear}
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
          modalInfo={performanceModalInfo}
          closePerformanceModal={closePerformanceModal}
          handleFormSubmit={handlePerformanceFormSubmit}
        />
      )}
    </div>
  );
}

export default KPIGroupedTable;
