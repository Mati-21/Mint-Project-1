import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import Minister from "./pages/Minister/Minister";
import Strategic from "./pages/Strategic/Strategic";
import Executive from "./pages/Executive/Executive";
import WorkUnit from "./pages/WorkUnit/WorkUnit";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

// import KpiAssignment from "./components/KpiAssignment";

import UserManagment from "./components/UserManagment";
import Alert from "./components/Alert";
import Configuration from "./components/Configuration";
import LiChart from "./components/Chart/LiChart";
import BChart from "./components/Chart/BChart";
import Chart from "./components/Chart";

import EditSystemSetting from "./components/EditSystemSetting";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SectorialPlan from "./components/Sector/SectorialPlan";
import Ministries from "./components/Sector/Ministries";
import InnovationAndResearch from "./components/Sector/InnovationAndResearch";
import Ict from "./components/Sector/Ict";
import Affiliated from "./components/Sector/Affiliated";
import MinisterOffice from "./components/Sector/MinisterOffice";
import AdminIssue from "./components/Sector/AdminIssue";
import AddGoalKraKpi from "./pages/Admin/AdminComponents/GoalKpiKra/AddGoalKraKpi";

import TargetValidation from "./pages/Strategic/StrategicComponents/TargetValidation";
import PerformanceValidation from "./pages/Strategic/StrategicComponents/PerformanceValidation";
import KpiAssignment from "./pages/Admin/AdminComponents/KpiAssignment";
import UserProfile from "./components/UserProfile";
import AllSector from "./components/Sector/AllSector";
import AllSubsector from "./components/Sector/AllSubsector";
import KpiYearAssignment from "./pages/Admin/AdminComponents/KpiYearAssignmentPage";
import { useEffect } from "react";
import useAuthStore from "./store/auth.store";
import ProtectRoute from "./utils/ProtectRoute";

function App() {
  const { checkAuth, isAuthenticated, user, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectRoute>
              <Admin />
            </ProtectRoute>
          }
        >
          <Route index element={<Navigate to="admin-dashboard" replace />} />
          <Route path="admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<Navigate to="chart" replace />} />
            <Route path="chart" element={<Chart />}>
              <Route index element={<Navigate to="linechart" replace />} />
              <Route path="linechart" element={<LiChart />} />
              <Route path="barchart" element={<BChart />} />
            </Route>

            <Route path="setting" element={<EditSystemSetting />} />
          </Route>
          <Route path="user-managment" element={<UserManagment />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="Kpi-Assign" element={<KpiAssignment />} />
          <Route path="alert" element={<Alert />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="Goal-Kra-Kpi" element={<AddGoalKraKpi />} />
          <Route path="Goal-" element={<AddGoalKraKpi />} />
          <Route path="Kpi-Year-Assign" element={<KpiYearAssignment />} />
        </Route>

        <Route
          path="/executive"
          element={
            <ProtectRoute>
              <Executive />
            </ProtectRoute>
          }
        >
          <Route index element={<Navigate to="sectorial-plan" replace />} />
          <Route path="sectorial-plan" element={<SectorialPlan />} />
          <Route path="ministries" element={<Ministries />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />
        </Route>

        <Route
          path="/strategic"
          element={
            <ProtectRoute>
              <Strategic />
            </ProtectRoute>
          }
        >
          <Route index element={<Navigate to="sectorial-plan" replace />} />
          <Route path="sectorial-plan" element={<SectorialPlan />} />
          <Route path="ministries" element={<Ministries />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />

          <Route
            path="innovation-research"
            element={<InnovationAndResearch />}
          />
          <Route path="ict" element={<Ict />} />
          <Route
            path="performance-validation"
            element={<PerformanceValidation />}
          />
          <Route path="Target-validation" element={<TargetValidation />} />
          <Route path="affiliated-institutions" element={<Affiliated />} />
          <Route path="minister-office" element={<MinisterOffice />} />
          <Route path="admin-issue" element={<AdminIssue />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/minister"
          element={
            <ProtectRoute>
              <Minister />
            </ProtectRoute>
          }
        >
          <Route index element={<Navigate to="sectorial-plan" replace />} />
          <Route path="sectorial-plan" element={<SectorialPlan />} />
          <Route path="ministries" element={<Ministries />} />
          <Route
            path="innovation-research"
            element={<InnovationAndResearch />}
          />
          <Route path="ict" element={<Ict />} />
          <Route path="affiliated-institutions" element={<Affiliated />} />
          <Route path="minister-office" element={<MinisterOffice />} />
          <Route path="admin-issue" element={<AdminIssue />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/executive"
          element={
            <ProtectRoute>
              <Executive />
            </ProtectRoute>
          }
        >
          <Route path="user-profile" element={<UserProfile />} />
        </Route>
        <Route
          path="/workunit"
          element={
            <ProtectRoute>
              <WorkUnit />
            </ProtectRoute>
          }
        >
          <Route path="user-profile" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
