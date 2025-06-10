import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  getActiveUsersStats,
  getProfile,
  logout,
} from "../controllers/userController.js";

import { validatePasswordStrength } from "../middlewares/validatePasswordStrength.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/create", validatePasswordStrength, createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.get("/active-users", getActiveUsersStats);

userRouter.get("/checkauth", checkAuth);

export default userRouter;
