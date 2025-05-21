import express from "express";
import { createGoal2, getAllGoals2 } from "../controllers/goalControllers2.js";

//import authUser from "../middlewares/authUser.js";

const goal2Router = express.Router();

// Protect both routes if necessary
goal2Router.post("/create-goal2", createGoal2);
goal2Router.get("/get-goal2", getAllGoals2);

export default goal2Router;
