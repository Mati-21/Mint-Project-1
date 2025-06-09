import express from 'express';
import {
  createOrUpdatePlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanTarget,
} from '../controllers/planControllers.js';

const planRouter = express.Router();

// Create or update a plan (upsert)
planRouter.post('/plans', createOrUpdatePlan);

// Get all plans (optionally filtered)
planRouter.get('/plans', getPlans);

// Get target by KPI ID, year, and optional quarter (must come BEFORE /plans/:id)
planRouter.get('/plans/target', getPlanTarget);

// Get plan by ID
planRouter.get('/plans/:id', getPlanById);

// Update a plan by ID (partial updates)
planRouter.put('/plans/:id', updatePlan);

// Delete a plan by ID
planRouter.delete('/plans/:id', deletePlan);

export default planRouter;
