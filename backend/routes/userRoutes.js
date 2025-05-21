import express from "express";
import {
  addUser,
  loginUser,
  getProfile,
  getActiveUsersStats,
} from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/add-user", addUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.get("/active-users", getActiveUsersStats);

export default userRouter;
