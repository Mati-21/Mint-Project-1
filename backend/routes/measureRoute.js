// routes/measureRoute.js
import express from "express";
import {
  addMeasure,
  getMeasuresByKpi,
  addNewAssignment,
} from "../controllers/measureController.js";

const measureRouter = express.Router();

measureRouter.post("/addMeasure", addMeasure);
measureRouter.post("/assign-measure", addNewAssignment);

// ✅ RESTful route to get measures by KPI ID
measureRouter.get("/by-kpi/:kpi_id", getMeasuresByKpi);

export default measureRouter;
