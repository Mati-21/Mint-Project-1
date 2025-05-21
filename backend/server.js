import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import planRouter from "./routes/planRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import goalRouter from "./routes/goalRoutes.js";
import kpiRouter from "./routes/kpiRoutes.js";

import kraRouter from "./routes/kraRoutes.js";

import sectorRouter from "./routes/sectorRoutes.js";
import subsectorRouter from "./routes/subsectorRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import goal2Router from "./routes/goalRoute2.js";
import kra2Router from "./routes/kraRoute2.js";
import kpi2Router from "./routes/kpiRoute2.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Routes and endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/plan", planRouter);
app.use("/api/reports", reportRouter);
app.use("/api/goal", goalRouter);
app.use("/api/kras", kraRouter);
app.use("/api/kpis", kpiRouter);
app.use("/api/sector", sectorRouter);
app.use("/api/subsector", subsectorRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/goal2", goal2Router);
app.use("/api/kras2", kra2Router);
app.use("/api/kpis2", kpi2Router);

//run server

const PORT = process.env.PORT || 1221;
app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
