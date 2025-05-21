import express from 'express'

import { createReport, getReports } from '../controllers/reportController.js';
const reportRouter = express.Router(); 

reportRouter.post('/create-report', createReport);
reportRouter.get('/get-report', getReports);

export default reportRouter;
