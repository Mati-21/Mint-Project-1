import express from 'express'
import { addSector, getAllSectors } from '../controllers/sectorControllers.js'

const sectorRouter = express.Router()

// Route to add sector
sectorRouter.post('/add-sector', addSector);
sectorRouter.get('/get-sector', getAllSectors);

export default sectorRouter
