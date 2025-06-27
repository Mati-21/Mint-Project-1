import Plan from '../models/planModels.js';
import Performance from '../models/performanceModel.js';
import User from '../models/userModels.js';
import Subsector from '../models/subsectorModel.js';
import Sector from '../models/sectorModel.js';

export const getKPITableData = async (req, res) => {
  try {
    let { userId, year, sectorId, subsectorId, role } = req.query;

    if (!userId || !year) {
      return res.status(400).json({ message: "Missing required query params: userId and year" });
    }

    // Normalize role to handle cases like "Strategic unit"
    role = (role || "").toLowerCase().trim();

    // Normalize role values
    if (role === "strategic unit") role = "strategic";
    if (role === "chief ceo") role = "chief ceo"; // keep same casing
    if (role === "minister") role = "minister";
    if (role === "ceo") role = "ceo";
    if (role === "worker") role = "worker";

    const yearNum = Number(year);
    let relevantUserIds = [userId];

    const currentUser = await User.findById(userId).populate("sector").populate("subsector");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allUsers = await User.find();

    if (role === "ceo") {
      relevantUserIds.push(
        ...allUsers
          .filter(u =>
            (u.role || "").toLowerCase() === "worker" &&
            u.subsector?.toString() === currentUser.subsector?._id.toString()
          )
          .map(u => u._id.toString())
      );
    }

    if (role === "chief ceo") {
      relevantUserIds.push(
        ...allUsers
          .filter(u =>
            ["worker", "ceo"].includes((u.role || "").toLowerCase()) &&
            u.sector?.toString() === currentUser.sector?._id.toString()
          )
          .map(u => u._id.toString())
      );
    }

    if (role === "strategic") {
      if (currentUser.sector?._id) {
        relevantUserIds.push(
          ...allUsers
            .filter(u =>
              ["chief ceo", "ceo", "worker"].includes((u.role || "").toLowerCase()) &&
              u.sector?.toString() === currentUser.sector._id.toString()
            )
            .map(u => u._id.toString())
        );
      } else {
        // No sector assigned: get all with relevant roles ignoring sector
        relevantUserIds.push(
          ...allUsers
            .filter(u =>
              ["chief ceo", "ceo", "worker"].includes((u.role || "").toLowerCase())
            )
            .map(u => u._id.toString())
        );
      }
    }

    if (role === "minister") {
      relevantUserIds.push(
        ...allUsers
          .filter(u =>
            ["strategic", "chief ceo", "ceo", "worker"].includes((u.role || "").toLowerCase())
          )
          .map(u => u._id.toString())
      );
    }

    // Deduplicate user IDs
    relevantUserIds = [...new Set(relevantUserIds)];

    // Prepare subsector filtering logic
    let subsectorIds = [];
    if (subsectorId) {
      subsectorIds = [subsectorId];
    } else if (sectorId) {
      subsectorIds = (await Subsector.find({ sectorId })).map(sub => sub._id.toString());
    } else if (!["strategic", "minister"].includes(role)) {
      // For non-Strategic and non-Minister roles, sectorId is required
      return res.status(400).json({ message: `Missing required sectorId for role ${role}` });
    }
    // For Strategic and Minister, sectorId and subsectorId can be optional

    // Build query for plans
    const planQuery = {
      userId: { $in: relevantUserIds },
      year: yearNum,
    };

    if (sectorId) {
      planQuery.sectorId = sectorId;
    } else if (!["strategic", "minister"].includes(role)) {
      return res.status(400).json({ message: `Missing sectorId for role ${role}` });
    }

    if (subsectorIds.length > 0) {
      planQuery.subsectorId = { $in: subsectorIds };
    }

    // Fetch plans
    const allPlans = await Plan.find(planQuery)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'subsector_name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc')
      .populate('userId', 'fullName role');

    // Fetch performances with same filters
    const performanceQuery = {
      userId: { $in: relevantUserIds },
      year: yearNum,
    };
    if (sectorId) performanceQuery.sectorId = sectorId;
    if (subsectorIds.length > 0) performanceQuery.subsectorId = { $in: subsectorIds };

    const allPerformances = await Performance.find(performanceQuery);

    // Map performances by planId
    const performanceMap = new Map();
    allPerformances.forEach(perf => {
      if (perf.planId) performanceMap.set(perf.planId.toString(), perf);
    });

    // Compose final KPI table data with ratios
    const kpiTableData = allPlans.map(plan => {
      const planIdStr = plan._id.toString();
      const performance = performanceMap.get(planIdStr);

      const targets = {
        [`year-${plan.year}`]: plan.target || 0,
        [`q1-${plan.year}`]: plan.q1 || 0,
        [`q2-${plan.year}`]: plan.q2 || 0,
        [`q3-${plan.year}`]: plan.q3 || 0,
        [`q4-${plan.year}`]: plan.q4 || 0,
      };

      const performanceValues = {
        [`year-${plan.year}`]: performance?.performanceYear || 0,
        [`q1-${plan.year}`]: performance?.performanceQ1 || 0,
        [`q2-${plan.year}`]: performance?.performanceQ2 || 0,
        [`q3-${plan.year}`]: performance?.performanceQ3 || 0,
        [`q4-${plan.year}`]: performance?.performanceQ4 || 0,
      };

      const ratio = {};
      for (const period of Object.keys(targets)) {
        const perfVal = performanceValues[period];
        const targVal = targets[period];
        ratio[period] = targVal === 0 ? 0 : Number(((perfVal / targVal) * 100).toFixed(2));
      }

      return {
        planId: plan._id,
        userId: plan.userId?._id?.toString() || "",
        userName: plan.userId?.fullName || "",
        userRole: plan.userId?.role || "",
        sector: plan.sectorId?.name || '',
        sectorId: plan.sectorId?._id?.toString() || '',
        subsector: plan.subsectorId?.subsector_name || '',
        subsectorId: plan.subsectorId?._id?.toString() || '',
        kpiName: plan.kpiId?.kpi_name || '',
        kpiId: plan.kpiId?._id?.toString() || '',
        goal: plan.goalId?.goal_desc || '',
        goalId: plan.goalId?._id?.toString() || '',
        kra: plan.kraId?.kra_name || '',
        kraId: plan.kraId?._id?.toString() || '',
        year: plan.year,
        targets,
        performance: performanceValues,
        ratio,
        description: plan.description || '',
      };
    });

    return res.status(200).json(kpiTableData);
  } catch (error) {
    console.error("❌ getKPITableData error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
