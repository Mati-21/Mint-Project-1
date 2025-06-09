import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

// Set up Multer for profile image upload
const upload = multer({ dest: "uploads/" });

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, getProfile);
profileRouter.put("/", authMiddleware, upload.single("profileImage"), updateProfile);

export default profileRouter;
