
import express from "express";
import {
  getAllKpiYearAssignments,
  updateKpiYearAssignmentYears,
  assignOrUpdateKpiYearAssignment,
} from "../controllers/kpiYearAssignmentController.js";

const kpiYearAssignmentRouter = express.Router();

// Fetch all KPI year assignments
kpiYearAssignmentRouter.get("/all", getAllKpiYearAssignments);

// Update startYear and endYear of an existing KPI year assignment by _id
kpiYearAssignmentRouter.put("/:id/update-years", updateKpiYearAssignmentYears);

// Assign or update KPI year (create if not found, update if exists)
kpiYearAssignmentRouter.post("/assign", assignOrUpdateKpiYearAssignment);

export default kpiYearAssignmentRouter;
