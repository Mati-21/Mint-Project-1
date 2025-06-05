import KpiYearAssignment from "../models/KpiYearAssignmentModel.js";
import sectorModel from "../models/sectorModel.js";
import subsectorModel from "../models/subsectorModel.js";
import KPI2 from "../models/kpiModel2.js";
import KRA2 from "../models/kraModel2.js";
import Goal2 from "../models/goalModel2.js";

// GET all KPI year assignments
export const getAllKpiYearAssignments = async (req, res) => {
  try {
    const { sectorId } = req.query;
    let filter = {};
    if (sectorId) filter.sectorId = sectorId;

    const assignments = await KpiYearAssignment.find(filter)
      .populate("sectorId", "sector_name")
      .populate("subsectorId", "subsector_name sectorId")
      .populate("deskId", "desk_name")
      .populate({
        path: "kpiId",
        select: "kpi_id kpi_name kra goal",
        populate: [
          { path: "kra", select: "kra_id kra_name" },
          { path: "goal", select: "goal_id goal_desc" },
        ],
      });

    const formatted = assignments.map((a) => {
      const kpi = a.kpiId || {};
      const kra = kpi.kra || {};
      const goal = kpi.goal || {};

      return {
        _id: a._id,
        sectorId: a.sectorId,
        subsectorId: a.subsectorId,
        deskId: a.deskId,
        kpi: {
          kpi_id: kpi.kpi_id,
          kpi_name: kpi.kpi_name,
          _id: kpi._id,
        },
        kra: {
          kra_id: kra.kra_id,
          kra_name: kra.kra_name,
        },
        goal: {
          goal_id: goal.goal_id,
          goal_desc: goal.goal_desc,
        },
        startYear: a.startYear,
        endYear: a.endYear,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error getting KPI year assignments:", error);
    res.status(500).json({ message: "Failed to fetch KPI year assignments" });
  }
};

// PUT update start/end year by ID
export const updateKpiYearAssignmentYears = async (req, res) => {
  console.log("→ PUT /api/year/:id/update-years → params:", req.params);
  console.log("→ PUT /api/year/:id/update-years → body:", req.body);
   console.error("Error in assignOrUpdateKpiYearAssignment:", error);
  try {
    const { id } = req.params;
    const { startYear, endYear } = req.body;

    if (
      typeof startYear !== "number" ||
      typeof endYear !== "number" ||
      startYear > endYear
    ) {
      return res.status(400).json({
        message:
          "Invalid startYear and endYear. Ensure they are numbers and startYear <= endYear.",
      });
    }

    const updatedAssignment = await KpiYearAssignment.findByIdAndUpdate(
      id,
      { startYear, endYear },
      { new: true }
    )
      .populate("sectorId", "sector_name")
      .populate("subsectorId", "subsector_name sectorId")
      .populate("deskId", "desk_name")
      .populate({
        path: "kpiId",
        select: "kpi_id kpi_name kra goal",
        populate: [
          { path: "kra", select: "kra_id kra_name" },
          { path: "goal", select: "goal_id goal_desc" },
        ],
      });

    if (!updatedAssignment) {
      return res.status(404).json({ message: "KPI year assignment not found" });
    }

    const kpi = updatedAssignment.kpiId || {};
    const kra = kpi.kra || {};
    const goal = kpi.goal || {};

    const formatted = {
      _id: updatedAssignment._id,
      sectorId: updatedAssignment.sectorId,
      subsectorId: updatedAssignment.subsectorId,
      deskId: updatedAssignment.deskId,
      kpi: {
        kpi_id: kpi.kpi_id,
        kpi_name: kpi.kpi_name,
        _id: kpi._id,
      },
      kra: {
        kra_id: kra.kra_id,
        kra_name: kra.kra_name,
      },
      goal: {
        goal_id: goal.goal_id,
        goal_desc: goal.goal_desc,
      },
      startYear: updatedAssignment.startYear,
      endYear: updatedAssignment.endYear,
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error updating KPI year assignment:", error);
    res.status(500).json({ message: "Failed to update KPI year assignment" });
  }
};

// POST create or update KPI year assignment
export const assignOrUpdateKpiYearAssignment = async (req, res) => {
  try {
    const {
      sectorId,
      subsectorId,
      deskId,
      kpiId,
      kraId,
      goalId,
      startYear,
      endYear,
    } = req.body;

    if (
      typeof startYear !== "number" ||
      typeof endYear !== "number" ||
      startYear > endYear
    ) {
      return res.status(400).json({
        message:
          "Invalid startYear and endYear. Ensure they are numbers and startYear <= endYear.",
      });
    }

    const filter = {
      sectorId,
      subsectorId: subsectorId || null,
      deskId: deskId || null,
      kpiId,
    };

    let assignment = await KpiYearAssignment.findOne(filter);

    if (assignment) {
      assignment.startYear = startYear;
      assignment.endYear = endYear;
      await assignment.save();
    } else {
      assignment = await KpiYearAssignment.create({
        ...filter,
        kraId,
        goalId,
        startYear,
        endYear,
      });
    }

    res.status(200).json({ message: "Year assignment successful", data: assignment });
  } catch (error) {
    console.error("Error assigning KPI year:", error);
    res.status(500).json({ message: "Server error during KPI year assignment" });
  }
};
