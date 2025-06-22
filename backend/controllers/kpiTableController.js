import Plan from '../models/planModels.js';
import Performance from '../models/performanceModel.js';
import KPI from '../models/kpiModel2.js';
import mongoose from 'mongoose';

// Helper to calculate ratio safely
const calculateRatio = (performance, target) => {
  if (!target || target === 0) return 0;
  return Math.min((performance / target) * 100, 100).toFixed(2);
};

// Fetch all plans with optional filters (for KPITable)
export const getPlans = async (req, res) => {
  try {
    const { userId, year, sectorId, subsectorId, kpiId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (year) filter.year = Number(year);
    if (sectorId) filter.sectorId = sectorId;
    if (subsectorId) filter.subsectorId = subsectorId;
    if (kpiId) filter.kpiId = kpiId;

    const plans = await Plan.find(filter)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc')
      .sort({ year: 1 });

    return res.status(200).json(plans);
  } catch (error) {
    console.error("getPlans error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Fetch all performances with optional filters (for KPITable)
export const getPerformances = async (req, res) => {
  try {
    const { userId, year, sectorId, subsectorId, kpiId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (year) filter.year = Number(year);
    if (sectorId) filter.sectorId = sectorId;
    if (subsectorId) filter.subsectorId = subsectorId;
    if (kpiId) filter.kpiId = kpiId;

    const performances = await Performance.find(filter)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc')
      .sort({ year: 1 });

    return res.status(200).json(performances);
  } catch (error) {
    console.error("getPerformances error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Combined KPI table data fetch with target, performance, and ratio calculation
export const getKPITableData = async (req, res) => {
  try {
    const { userId, year, sectorId, subsectorId } = req.query;

    if (!userId || !year || !sectorId) {
      return res.status(400).json({ message: "Missing required query params: userId, year, sectorId" });
    }

    const planFilter = { userId, year: Number(year), sectorId };
    if (subsectorId) planFilter.subsectorId = subsectorId;

    const plans = await Plan.find(planFilter)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc');

    const perfFilter = { userId, year: Number(year), sectorId };
    if (subsectorId) perfFilter.subsectorId = subsectorId;

    const performances = await Performance.find(perfFilter);

    // Map performances by planId string for quick lookup
    const performanceMap = new Map();
    performances.forEach(perf => {
      if (perf.planId) performanceMap.set(perf.planId.toString(), perf);
    });

    const kpiTableData = plans.map(plan => {
      const planIdStr = plan._id.toString();
      const performance = performanceMap.get(planIdStr);

      // Targets from Plan
      const targets = {
        [`year-${plan.year}`]: plan.target || 0,
        [`q1-${plan.year}`]: plan.q1 || 0,
        [`q2-${plan.year}`]: plan.q2 || 0,
        [`q3-${plan.year}`]: plan.q3 || 0,
        [`q4-${plan.year}`]: plan.q4 || 0,
      };

      // Performance values from Performance document
      const performanceValues = {
        [`year-${plan.year}`]: performance ? performance.performanceYear || 0 : 0,
        [`q1-${plan.year}`]: performance ? performance.performanceQ1 || 0 : 0,
        [`q2-${plan.year}`]: performance ? performance.performanceQ2 || 0 : 0,
        [`q3-${plan.year}`]: performance ? performance.performanceQ3 || 0 : 0,
        [`q4-${plan.year}`]: performance ? performance.performanceQ4 || 0 : 0,
      };

      // Calculate ratio per period, capped at 100%
      const ratio = {};
      for (const periodKey of Object.keys(targets)) {
        const perfVal = performanceValues[periodKey];
        const targVal = targets[periodKey];
        ratio[periodKey] = targVal === 0 ? 0 : Number(Math.min((perfVal / targVal) * 100, 100).toFixed(2));
      }

      return {
        planId: plan._id,
        userId: plan.userId ? plan.userId.toString() : "",
        sector: plan.sectorId?.name || '',
        subsector: plan.subsectorId?.name || '',
        kpiName: plan.kpiId?.kpi_name || '',
        goal: plan.goalId?.goal_desc || '',
        kra: plan.kraId?.kra_name || '',
        year: plan.year,
        targets,
        performance: performanceValues,
        ratio,
        description: plan.description || '',
      };
    });

    return res.status(200).json(kpiTableData);
  } catch (error) {
    console.error("getKPITableData error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
