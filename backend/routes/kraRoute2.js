import express from "express";
import { createKRA, getAllKRAs } from "../controllers/kraController2.js";
//import authUser from "../middlewares/authUser.js";

const kra2Router = express.Router();

kra2Router.post("/create-kra2", createKRA);
kra2Router.get("/get-kra2", getAllKRAs);

export default kra2Router;
