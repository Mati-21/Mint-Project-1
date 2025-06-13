import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

// Routes and Middleware
import authMiddleware from "./middlewares/authMiddleware.js";
import profileRouter from "./routes/profileRoutes.js";
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
import kpiAssignmentRouter from "./routes/kpiAssignmentRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import kpiYearAssignmentRouter from "./routes/kpiYearAssignmentRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import targetRouter from "./routes/targetValidationRoutes.js";
import performanceValidationRouter from "./routes/performanceValidationRoutes.js";

// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env and connect DB
dotenv.config();
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//app.options("*", cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  })
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/api/profile", authMiddleware, profileRouter); // Profile GET
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/plan", planRouter);
app.use("/api/reports", reportRouter);
app.use("/api/goal", goalRouter);
app.use("/api/kras", kraRouter);
app.use("/api/kpis", kpiRouter);
app.use("/api/kpis2", kpi2Router);
app.use("/api/sector", sectorRouter);
app.use("/api/subsector", subsectorRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/goal2", goal2Router);
app.use("/api/kras2", kra2Router);
app.use("/api/assign", kpiAssignmentRouter);
app.use("/api/menu", menuRouter);
app.use("/api/year", kpiYearAssignmentRouter);
app.use("/api", planRoutes); // this may duplicate /api/plan
app.use("/api", performanceRoutes);
app.use("/api/target-validation", targetRouter);
app.use("/api/performance-validation", performanceValidationRouter);

// Run server
const PORT = process.env.PORT || 1221;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
