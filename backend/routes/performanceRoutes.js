import express from 'express';
import {
  createOrUpdatePerformance,
  getPerformances,
} from '../controllers/performanceController.js';

const performanceRouter = express.Router();

// Create or update performance record
performanceRouter.post('/performance', createOrUpdatePerformance);

// Get performances by userId and optional filters
performanceRouter.get('/performance', getPerformances);

export default performanceRouter;
