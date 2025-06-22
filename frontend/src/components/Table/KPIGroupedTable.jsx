import React, { useState, useEffect } from "react";
import KPITable from "./KPITable";
import Filters from "./Filters";
import PlanModal from "./PlanModal";
import PerformanceModal from "./PerformanceModal";
import RatioModal from "./RatioModal";
import useAuthStore from "../../store/auth.store";

const BACKEND_URL = "http://localhost:1221";

function getCurrentEthiopianYear() {
  const today = new Date();
  const gYear = today.getFullYear();
  const gMonth = today.getMonth() + 1;
  const gDate = today.getDate();
  const isLeapYear = (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
  const newYearDay = isLeapYear ? 12 : 11;
  return gMonth < 9 || (gMonth === 9 && gDate < newYearDay) ? gYear - 8 : gYear - 7;
}

function extractId(idField) {
  if (!idField) return "";
  if (typeof idField === "string") return idField;
  if (typeof idField === "object") {
    if ("_id" in idField) return extractId(idField._id);
    if ("id" in idField) return extractId(idField.id);
    if (typeof idField.toString === "function") {
      const str = idField.toString();
      if (str !== "[object Object]") return str;
    }
  }
  return "";
}

// Merge rows with the same KPI so multi-year data combines into one object
function mergeRowsByKpi(rows) {
  const merged = {};
  rows.forEach((row) => {
    const key = row.kpiId || row.kpiName;
    if (!merged[key]) {
      merged[key] = { ...row };
    } else {
      merged[key].targets = { ...(merged[key].targets || {}), ...(row.targets || {}) };
      merged[key].performance = { ...(merged[key].performance || {}), ...(row.performance || {}) };
      merged[key].ratio = { ...(merged[key].ratio || {}), ...(row.ratio || row.ratios || {}) };
    }
  });
  return Object.values(merged);
}

function KPIGroupedTable({ data, detailedKpis }) {
  const { user: authUser } = useAuthStore();

  const [showTableDebug, setShowTableDebug] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const [filterYear, setFilterYear] = useState("");
  const [filterGoal, setFilterGoal] = useState("");
  const [filterKra, setFilterKra] = useState("");
  const [filterKpiName, setFilterKpiName] = useState("");

  const [planModalInfo, setPlanModalInfo] = useState(null);
  const [performanceModalInfo, setPerformanceModalInfo] = useState(null);
  const [ratioModalInfo, setRatioModalInfo] = useState(null);
  const [planIds, setPlanIds] = useState({});
  const [tableValues, setTableValues] = useState({});
  const [loadingTableValues, setLoadingTableValues] = useState(true);

  const currentEthYear = getCurrentEthiopianYear();

  const getKpiKey = (row, quarter, year) =>
    `${row.kpiId || row.kpiName}_${quarter || "year"}_${year}`;

  useEffect(() => {
    if (authUser && (authUser.id || authUser._id) && authUser.role) {
      setIsUserReady(true);
    }
  }, [authUser]);


  useEffect(() => {
  const fetchTableValues = async () => {
    const user = authUser || {};
    const userId = extractId(user.id || user._id);
    const role = user.role || "";

    const sectorId = extractId(user.sectorId) || extractId(user.sector) || "";
    const subsectorId = extractId(user.subsectorId) || extractId(user.subsector) || "";

    if (!userId || !role) {
      console.warn("User info missing: cannot fetch KPI table values.");
      setLoadingTableValues(false);
      return;
    }

    try {
      const baseParams = new URLSearchParams();
      baseParams.append("userId", userId);
      baseParams.append("role", role);

      if (role === "CEO" || role === "Worker") {
        if (!sectorId || !subsectorId) {
          console.warn("SectorId and SubsectorId are required for CEO and Worker roles.");
          setLoadingTableValues(false);
          return;
        }
        baseParams.append("sectorId", sectorId);
        baseParams.append("subsectorId", subsectorId);
      } else if (role === "Chief CEO") {
        if (!sectorId) {
          console.warn("SectorId is required for Chief CEO role.");
          setLoadingTableValues(false);
          return;
        }
        baseParams.append("sectorId", sectorId);
        if (subsectorId) baseParams.append("subsectorId", subsectorId);
      } else {
        if (sectorId) baseParams.append("sectorId", sectorId);
        if (subsectorId) baseParams.append("subsectorId", subsectorId);
      }

      const yearsToFetch = [currentEthYear - 1, currentEthYear];

      let combinedResults = [];
      for (const year of yearsToFetch) {
        const params = new URLSearchParams(baseParams.toString());
        params.set("year", year.toString());

        const url = `${BACKEND_URL}/api/kpi-table/table-data?${params.toString()}`;
        console.log("Fetching KPI table data from:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch KPI table data for year ${year}.`);

        const result = await response.json();
        console.log(`Raw API response for year ${year}:`, result);

        if (Array.isArray(result)) {
          const transformed = result.map((item) => {
            const targets = { ...(item.targets || {}) };

            const performance = {
              ...item.performance,
              Q1: item.q1Performance?.value ?? 0,
              Q2: item.q2Performance?.value ?? 0,
              Q3: item.q3Performance?.value ?? 0,
              Q4: item.q4Performance?.value ?? 0,
            };

            const ratios = item.ratios || item.ratio || {};

            return {
              ...item,
              targets,
              performance,
              ratios,
            };
          });

          combinedResults = combinedResults.concat(transformed);
        } else if (result.grouped) {
          Object.values(result.grouped).forEach((arr) => {
            combinedResults = combinedResults.concat(arr);
          });
        }
      }

      const groupedData = {};
      combinedResults.forEach((item) => {
        const groupKey = `${item.goal}||${item.kra}`;
        if (!groupedData[groupKey]) groupedData[groupKey] = [];
        groupedData[groupKey].push(item);
      });

      setTableValues(groupedData);
    } catch (error) {
      console.error("Error fetching KPI table values:", error);
    } finally {
      setLoadingTableValues(false);
    }
  };

  fetchTableValues();
}, [authUser, currentEthYear]);


  if (!isUserReady) return <div className="p-4">Loading user information...</div>;

  // Normalize incoming KPI data
  const normalizedData = [];
  data.forEach((goal) => {
    const goalName = goal.goal_desc || "N/A";
    goal.kras?.forEach((kra) => {
      const kraName = kra.kra_name || "N/A";
      kra.kpis?.forEach((kpi) => {
        const kpiDetail = detailedKpis.find((d) => d._id === kpi._id) || {};
        normalizedData.push({
          kpiId: kpiDetail.kpiId || kpi.kpiId || kpi._id,
          kpiName: kpiDetail.kpi_name || kpi.kpi_name,
          kraId: kpiDetail.kraId || kra.kra_id || kra._id,
          sectorId: kpiDetail.sectorId || null,
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

  // Filter normalized data
  const filteredData = normalizedData.filter((row) =>
    (!filterYear || row.year?.toString().includes(filterYear.trim())) &&
    (!filterGoal || row.goal?.toLowerCase().includes(filterGoal.trim().toLowerCase())) &&
    (!filterKra || row.kra?.toLowerCase().includes(filterKra.trim().toLowerCase())) &&
    (!filterKpiName || row.kpiName?.toLowerCase().includes(filterKpiName.trim().toLowerCase()))
  );

  // Group filtered data by goal||kra
  const groupedData = {};
  filteredData.forEach((row) => {
    const groupKey = `${row.goal}||${row.kra}`;
    if (!groupedData[groupKey]) groupedData[groupKey] = [];
    groupedData[groupKey].push(row);
  });

  // Enrich rows with fetched tableValues, merged by KPI
  const enrichRowsWithFetchedValues = (rows, groupKey) => {
    const fetchedRows = tableValues[groupKey] || [];
    const mergedFetchedRows = mergeRowsByKpi(fetchedRows);
    return rows.map((row) => {
      const fetchedRow = mergedFetchedRows.find((f) => f.kpiId === row.kpiId || f.kpiName === row.kpiName);
      return {
        ...row,
        targets: fetchedRow?.targets || {},
        performance: fetchedRow?.performance || {},
        ratios: fetchedRow?.ratio || fetchedRow?.ratios || {},
      };
    });
  };

  const enrichedGroupedData = {};
  Object.entries(groupedData).forEach(([groupKey, rows]) => {
    enrichedGroupedData[groupKey] = enrichRowsWithFetchedValues(rows, groupKey);
  });

  // Modal handlers (same as your existing code)
  const openModal = (row, field) => {
    const sectorId = extractId(authUser.sectorId) || extractId(authUser.sector) || "";
    const subsectorId = extractId(authUser.subsectorId) || extractId(authUser.subsector) || "";
    const userId = extractId(authUser.id || authUser._id);

    setPlanModalInfo({
      ...row,
      field,
      userId,
      role: authUser.role,
      sectorId,
      subsectorId,
    });
  };

  const closeModal = () => setPlanModalInfo(null);

  const handlePlanFormSubmit = async (formData) => {
    try {
      const body = { ...formData };
      Object.entries(body).forEach(([key, val]) => {
        if (!val || val === "N/A") delete body[key];
      });

      const response = await fetch(`${BACKEND_URL}/api/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const kpiKey = getKpiKey(formData, formData.quarter, formData.year);
      setPlanIds((prev) => ({
        ...prev,
        [kpiKey]: result._id || result.planId,
      }));

      alert("Plan saved!");
      closeModal();
    } catch (error) {
      alert("Failed to save plan: " + error.message);
    }
  };

  const openPerformanceModal = (row, field) => {
    const quarter = field?.toLowerCase().startsWith("q") ? field.toUpperCase() : null;
    const kpiKey = getKpiKey(row, quarter, row.year);
    const planId = planIds[kpiKey] || "";

    const sectorId = extractId(authUser.sectorId) || extractId(authUser.sector) || "";
    const subsectorId = extractId(authUser.subsectorId) || extractId(authUser.subsector) || "";
    const userId = extractId(authUser.id || authUser._id);

    setPerformanceModalInfo({
      ...row,
      field,
      quarter,
      planId,
      userId,
      role: authUser.role,
      sectorId,
      subsectorId,
      kpi_name: row.kpiName,
    });
  };

  const closePerformanceModal = () => setPerformanceModalInfo(null);

  const handlePerformanceFormSubmit = async (formData) => {
    try {
      const sectorId = extractId(formData.sectorId) || extractId(authUser.sectorId) || extractId(authUser.sector) || "";
      const subsectorId = extractId(formData.subsectorId) || extractId(authUser.subsectorId) || extractId(authUser.subsector) || "";
      const userId = extractId(formData.userId) || extractId(authUser.id || authUser._id);

      const body = {
        ...formData,
        userId,
        role: formData.role || authUser.role,
        sectorId,
        subsectorId,
        kpi_name: formData.kpi_name || formData.kpiName || "",
      };

      Object.entries(body).forEach(([key, val]) => {
        if (!val || val === "N/A") delete body[key];
      });

      const response = await fetch(`${BACKEND_URL}/api/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Server error");

      alert("Performance saved!");
      closePerformanceModal();
    } catch (error) {
      alert("Failed to save performance: " + error.message);
    }
  };

  const openRatioModal = (row, field) => {
    const [quarterRaw, year] = field.split("-");
    const quarter = quarterRaw.toUpperCase();
    const kpiKey = getKpiKey(row, quarter, year);
    const planId = planIds[kpiKey] || "";

    const actualTarget = row?.targets?.[quarter.toLowerCase()] ?? row?.target ?? null;
    const actualPerformance = row?.performance?.[quarter.toLowerCase()] ?? row?.performanceMeasure ?? null;

    const sectorId = extractId(authUser.sectorId) || extractId(authUser.sector) || "";
    const subsectorId = extractId(authUser.subsectorId) || extractId(authUser.subsector) || "";
    const userId = extractId(authUser.id || authUser._id);

    setRatioModalInfo({
      ...row,
      field,
      quarter,
      year,
      planId,
      target: actualTarget,
      performance: actualPerformance,
      userId,
      role: authUser.role,
      sectorId,
      subsectorId,
    });
  };

  const closeRatioModal = () => setRatioModalInfo(null);

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

      <div className="mb-4">
        <button
          onClick={() => setShowTableDebug((prev) => !prev)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
        >
          {showTableDebug ? "Hide Raw API Table Data" : "Show Raw API Table Data"}
        </button>

        {showTableDebug && (
          <pre className="mt-2 bg-gray-100 text-xs p-2 border border-gray-300 max-h-96 overflow-auto">
            {JSON.stringify(tableValues, null, 2)}
          </pre>
        )}
      </div>

      {loadingTableValues ? (
        <p>Loading KPI values...</p>
      ) : Object.entries(enrichedGroupedData).length > 0 ? (
        Object.entries(enrichedGroupedData).map(([groupKey, rows], idx) => (
          <KPITable
            key={idx}
            groupKey={groupKey}
            rows={rows}
            openModal={openModal}
            openPerformanceModal={openPerformanceModal}
            openRatioModal={openRatioModal}
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
          closeModal={closePerformanceModal}
          handleFormSubmit={handlePerformanceFormSubmit}
        />
      )}

      {ratioModalInfo && (
        <RatioModal modalInfo={ratioModalInfo} closeModal={closeRatioModal} />
      )}
    </div>
  );



}



export default KPIGroupedTable;
