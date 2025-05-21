import express from "express";
import {
  createKPI,
  getAllKPIs,
  getAllKPIData,
} from "../controllers/kpiControllers2.js";
const kpi2Router = express.Router();
kpi2Router.post("/create-kpi2", createKPI);
kpi2Router.get("/all2", getAllKPIs);
kpi2Router.get("/get-kpi2", getAllKPIData);
export default kpi2Router;
