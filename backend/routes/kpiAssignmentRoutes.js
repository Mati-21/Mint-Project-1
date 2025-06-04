import express from "express";
import { assignKpi, getAllAssignedKpis, getAssignedKpis } from "../controllers/kpiAssignmentController.js";

const kpiAssignmentRouter = express.Router();

kpiAssignmentRouter.post("/assign-kpi", assignKpi);
kpiAssignmentRouter.get("/assigned-kpi", getAllAssignedKpis);
kpiAssignmentRouter.get("/assigned-kpi/:id", getAssignedKpis);

export default kpiAssignmentRouter;
