<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import express from "express";
import {
  getAllKpiYearAssignments,
  updateKpiYearAssignmentYears,
  assignOrUpdateKpiYearAssignment,
} from "../controllers/kpiYearAssignmentController.js";

const kpiYearAssignmentRouter = express.Router();

<<<<<<< Updated upstream
// Fetch all KPI year assignments
kpiYearAssignmentRouter.get("/all", getAllKpiYearAssignments);

// Update startYear and endYear of an existing KPI year assignment by _id
kpiYearAssignmentRouter.put("/:id/update-years", updateKpiYearAssignmentYears);

// Assign or update KPI year (create if not found, update if exists)
=======
// Fetch all KPI year assignments (GET /api/year/all)
kpiYearAssignmentRouter.get("/all", getAllKpiYearAssignments);

// Also respond to GET /api/year/assigned-kpi-year
kpiYearAssignmentRouter.get("/assigned-kpi-year", getAllKpiYearAssignments);

// Update startYear and endYear of an existing KPI year assignment by assignment ID (PUT /api/year/:id/update-years)
kpiYearAssignmentRouter.put("/:id/update-years", updateKpiYearAssignmentYears);

// Assign or update KPI year (POST /api/year/assign)
>>>>>>> Stashed changes
kpiYearAssignmentRouter.post("/assign", assignOrUpdateKpiYearAssignment);

export default kpiYearAssignmentRouter;
