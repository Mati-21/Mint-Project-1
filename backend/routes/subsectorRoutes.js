import express from 'express'
import { addSubsector, getAllSubsectors } from '../controllers/subsectorControllers.js'



const subsectorRouter = express.Router()

subsectorRouter.post('/add-subsector', addSubsector);
subsectorRouter.get('/get-subsector', getAllSubsectors);

export default subsectorRouter
