import express from "express";
import {
  createOrUpdateAssignment,
  getAssignmentsByUserId,
} from "../controllers/measureAssignmentController.js";

const router = express.Router();

router.post("/assign", createOrUpdateAssignment);
router.get("/user/:id", getAssignmentsByUserId);

export default router;
