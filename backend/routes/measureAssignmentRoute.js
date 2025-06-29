import express from "express";
import {
  createOrUpdateAssignment,
  getAssignment,
} from "../controllers/measureAssignmentController.js";

const router = express.Router();

router.post("/assign", createOrUpdateAssignment);

export default router;
