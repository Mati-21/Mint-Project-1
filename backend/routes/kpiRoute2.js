// routes/kpiRoutes2.js

import express from "express";
import {
  createKPI,
  getAllKPIs,
  getAllKPIData,
  getAssignedKPIs, // ✅ Include this
} from "../controllers/kpiControllers2.js";

const kpi2Router = express.Router();

kpi2Router.post("/create-kpi2", createKPI);
kpi2Router.get("/all2", getAllKPIs);
kpi2Router.get("/get-kpi2", getAllKPIData);
kpi2Router.get("/assigned-kpi", getAssignedKPIs); // ✅ Add route

export default kpi2Router;
