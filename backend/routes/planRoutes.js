import express from "express";
import { createPlan, getPlans } from "../controllers/planControllers.js";
import authUser from "../middlewares/authUser.js";

const planRouter = express.Router();

planRouter.post("/add-plan", authUser, createPlan);
planRouter.get("/get-plan", getPlans);

export default planRouter;
