// routes/performanceValidationRoutes.js
import express from 'express';
import {
  getAllPerformances,
  validatePerformance,
} from '../controllers/performanceValidationController.js';

const performanceValidationRouter = express.Router();  // FIXED here: express.Router(), not express.targetRouter()

// Get all plans
performanceValidationRouter.get('/', getAllPerformances);

// Validate performance (approve/reject/pending)
performanceValidationRouter.patch('/validate/:id', validatePerformance);


export default performanceValidationRouter;
