import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChiefCEO from "./pages/ChiefCEO/ChiefCEO";
import CEO from "./pages/CEO/CEO";
import Strategic from "./pages/Strategic/Strategic";
import Minister from "./pages/Minister/Minister";
import Worker from "./pages/Worker/Worker";

// local
import useAuthStore from "./store/auth.store";
import { useEffect } from "react";
import Login from "./Authentication/Login/Login";
import ProtectRoute from "./utils/ProtectRoute";
import Admin from "./pages/SystemAdmin/Admin";
import AdminDashboard from "./pages/SystemAdmin/AdminDashboard";
import Chart from "./components/Chart/Chart";
import UserManagment from "./components/UserManagment";
import Alert from "./components/Alert";
import Configuration from "./components/Configuration";
import LiChart from "./components/Chart/LiChart";
import BChart from "./components/Chart/BChart";
import EditSystemSetting from "./components/EditSystemSetting";
import UserProfile from "./components/UserProfile";
import KpiAssignment from "./pages/SystemAdmin/AdminComponents/KpiAssignment";
import KpiYearAssignmentPage from "./pages/SystemAdmin/AdminComponents/KpiYearAssignmentPage";
import AddGoalKraKpi from "./pages/SystemAdmin/AdminComponents/GoalKpiKra/AddGoalKraKpi";
import AllSector from "./components/Sector/AllSector";
import AllSubsector from "./components/Sector/AllSubsector";
import PerformanceValidation from "./pages/Strategic/StrategicComponents/PerformanceValidation";
import TargetValidation from "./pages/Strategic/StrategicComponents/TargetValidation";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Dashboard from "./components/DashboardComponent/Dashboard";

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
          <Route path="Kpi-Year-Assign" element={<KpiYearAssignmentPage />} />
        </Route>

        <Route
          path="/chief-ceo"
          element={
            <ProtectRoute>
              <ChiefCEO />
            </ProtectRoute>
          }
        >
          {/* <Route index element={<Navigate to="sectorial-plan" replace />} /> */}
          <Route index element={<Dashboard />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/ceo"
          element={
            <ProtectRoute>
              <CEO />
            </ProtectRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/strategic"
          element={
            <ProtectRoute>
              <Strategic />
            </ProtectRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />

          <Route
            path="performance-validation"
            element={<PerformanceValidation />}
          />
          <Route path="Target-validation" element={<TargetValidation />} />

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
          <Route index element={<Dashboard />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/worker"
          element={
            <ProtectRoute>
              <Worker />
            </ProtectRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="allSector/:sectorId" element={<AllSector />} />
          <Route path="allSubsector/:subsectorId" element={<AllSubsector />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        {/* Page Not Found  */}

        <Route path="*" element={<PageNotFound />} />

        {/*  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
