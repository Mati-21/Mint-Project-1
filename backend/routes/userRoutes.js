import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  getActiveUsersStats,
  getProfile,
} from "../controllers/userController.js";

import { validatePasswordStrength } from "../middlewares/validatePasswordStrength.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/create", validatePasswordStrength, createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.get("/active-users", getActiveUsersStats);

export default userRouter;
