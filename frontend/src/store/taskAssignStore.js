import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = `http://localhost:1221`;

export const taskAssignStore = create((set) => ({
  AssignedKpis: [],
  isLoading: false,
  AllMeasures: [],

  fetchKpi: async (subSectorId) => {
    const assignedRes = await axios.get(
      `${BACKEND_URL}/api/assign/assigned-kpi-with-goal-details/${subSectorId}`,
      { headers: { Accept: "application/json" } }
    );
    return assignedRes;
  },

  // ✅ RESTful GET request to fetch measures by KPI ID
  fetchMeasuresByKpi: async (kpiId) => {
    const res = await axios.get(`${BACKEND_URL}/api/measures/by-kpi/${kpiId}`);
    set({ AllMeasures: res.data.data });
    return res.data.data;
  },

  AssignMeasure: async (newAssign) => {
    const assignedRes = await axios.post(
      `${BACKEND_URL}/api/measures/assign-measure`,
      newAssign
    );
    return assignedRes;
  },

  fetchAssignedTask: async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:1221/api/measureAssignment/user/${userId}`
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  },
}));
