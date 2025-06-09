import Plan from '../models/planModels.js';
import mongoose from 'mongoose';
import KPI from '../models/kpiModel2.js';
import KpiAssignment from '../models/kpiAssignmentModel.js';

// Create or update a plan (yearly or quarterly target)
export const createOrUpdatePlan = async (req, res) => {
  console.log("Received createOrUpdatePlan request body:", req.body);
  try {
    const {
      userId,
      role,
      kpi_name,
      year,
      target,
      description,
      deskId,
      quarter,
      kraId,
      goalId,
      sectorId: inputSectorId,
      subsectorId: inputSubsectorId,
    } = req.body;

    // Basic validations
    if (!userId || !role || !kpi_name || !year) {
      return res.status(400).json({ message: "Missing required fields: userId, role, kpi_name, or year." });
    }

    // Find KPI document
    const kpiDoc = await KPI.findOne({ kpi_name });
    if (!kpiDoc) {
      return res.status(404).json({ message: `KPI not found for name: ${kpi_name}` });
    }

    const kpiId = kpiDoc._id;
    const kpiKraId = kpiDoc.kraId;
    const kpiGoalId = kpiDoc.goalId;

    // Use provided kraId and goalId or fallback from KPI doc
    const finalKraId = kraId || kpiKraId;
    const finalGoalId = goalId || kpiGoalId;

    if (!finalKraId || !finalGoalId) {
      return res.status(400).json({ message: "KPI must have associated KRA and Goal." });
    }

    // Determine sectorId and subsectorId, try fallback from KpiAssignment if missing
    let sectorId = inputSectorId;
    let subsectorId = inputSubsectorId;

    if (!sectorId || !subsectorId) {
      const assignment = await KpiAssignment.findOne({ kpiId });
      if (assignment) {
        if (!sectorId && assignment.sectorId) sectorId = assignment.sectorId;
        if (!subsectorId && assignment.subsectorId) subsectorId = assignment.subsectorId;
      }
    }

    if (!sectorId) {
      return res.status(400).json({ message: "Sector ID is required and could not be auto-filled." });
    }

    // Filter for unique plan: kpiId + year + sectorId + subsectorId
    const planFilter = { kpiId, year, sectorId, subsectorId };

    // Try to find existing plan
    let existingPlan = await Plan.findOne(planFilter);

    // Replace quarterly target update block with this:
    if (quarter && target !== undefined) {
      const qKey = quarter.toLowerCase(); // e.g. 'q1'
      if (!['q1', 'q2', 'q3', 'q4'].includes(qKey)) {
        return res.status(400).json({ message: "Invalid quarter value. Must be one of q1, q2, q3, q4." });
      }

      const quarterTargetNum = Number(target); // use target as quarter target
      if (isNaN(quarterTargetNum)) {
        return res.status(400).json({ message: "Quarter target must be a valid number." });
      }

      if (existingPlan) {
        existingPlan[qKey] = quarterTargetNum;
        // Optional: also update yearly target if needed
        // existingPlan.target = targetNum; 
        if (description !== undefined) existingPlan.description = description;
        const updatedPlan = await existingPlan.save();
        return res.status(200).json(updatedPlan);
      } else {
        // Create new plan with quarter target set, yearly target 0 by default
        const newPlan = new Plan({
          userId,
          role,
          sectorId,
          subsectorId,
          deskId,
          kpiId,
          kpi_name,
          kraId: finalKraId,
          goalId: finalGoalId,
          year,
          target: 0,
          [qKey]: quarterTargetNum,
          description: description || '',
        });
        const savedPlan = await newPlan.save();
        return res.status(201).json(savedPlan);
      }
    }

    // Handle yearly target update/create (when no quarter is provided)
    if (target === undefined) {
      return res.status(400).json({ message: "Target is required when quarter info is not provided." });
    }

    const targetNum = Number(target);
    if (isNaN(targetNum)) {
      return res.status(400).json({ message: "Target must be a valid number." });
    }

    // Preserve quarterly targets from existing plan if any
    const updateData = {
      userId,
      role,
      sectorId,
      subsectorId,
      deskId,
      kpiId,
      kpi_name,
      kraId: finalKraId,
      goalId: finalGoalId,
      year,
      target: targetNum,
      description: description || '',
      createdAt: existingPlan ? existingPlan.createdAt : new Date(),
      q1: existingPlan?.q1 || 0,
      q2: existingPlan?.q2 || 0,
      q3: existingPlan?.q3 || 0,
      q4: existingPlan?.q4 || 0,
    };

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const savedPlan = await Plan.findOneAndUpdate(planFilter, updateData, options);

    return res.status(201).json(savedPlan);
  } catch (error) {
    console.error("createOrUpdatePlan error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};



// Get all plans (with optional filters)
export const getPlans = async (req, res) => {
  try {
    const { userId, year, sectorId, subsectorId, deskId, kpiId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (year) filter.year = year;
    if (sectorId) filter.sectorId = sectorId;
    if (subsectorId) filter.subsectorId = subsectorId;
    if (deskId) filter.deskId = deskId;
    if (kpiId) filter.kpiId = kpiId;

    const plans = await Plan.find(filter)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
      .populate('deskId', 'name')
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

// Get a single plan by ID
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    const plan = await Plan.findById(id)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
      .populate('deskId', 'name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc');

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.status(200).json(plan);
  } catch (error) {
    console.error("getPlanById error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Update a plan by ID
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    if (updateData.target !== undefined) {
      const targetNum = Number(updateData.target);
      if (isNaN(targetNum)) {
        return res.status(400).json({ message: "Target must be a valid number." });
      }
      updateData.target = targetNum;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("updatePlan error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Delete a plan by ID
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    console.error("deletePlan error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get plan target by KPI name, KRA, role, sector, user, year, optional quarter
export const getPlanTarget = async (req, res) => {
  try {
    const kpi_name = req.query.kpi_name || req.query.kpiName;
    const {
      kraId,
      role,
      sectorId,
      subsectorId,
      userId,
      year,
      quarter,
    } = req.query;

    if (!kpi_name || !kraId || !role || !sectorId || !userId || !year) {
      return res.status(400).json({ message: "Missing required query parameters." });
    }

    const kpiDoc = await KPI.findOne({ kpi_name });
    if (!kpiDoc) {
      return res.status(404).json({ message: `KPI not found for name: ${kpi_name}` });
    }

    const kpiId = kpiDoc._id;

    const filter = {
      kpiId,
      kraId,
      role,
      sectorId,
      userId,
      year,
    };
    if (subsectorId) filter.subsectorId = subsectorId;

    const plan = await Plan.findOne(filter);
    if (!plan) {
      return res.status(404).json({ message: "No plan found for the specified criteria." });
    }

    // If quarter specified, return quarter target
    if (quarter) {
      const qKey = quarter.toLowerCase();
      const quarterTarget = plan[qKey];
      return res.status(200).json({
        target: quarterTarget !== undefined ? quarterTarget : "",
        description: plan.description,
        year: plan.year,
      });
    }

    // Otherwise return yearly target
    return res.status(200).json({
      target: plan.target,
      description: plan.description,
      year: plan.year,
    });
  } catch (error) {
    console.error("getPlanTarget error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
