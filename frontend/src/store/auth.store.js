import { create } from "zustand";
import axios from "axios";

const backendUrl = "http://localhost:1221";

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  adminLogin: async (normalizedEmail, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/admin/login`, {
        email: normalizedEmail,
        password,
      });

      const data = response.data;
      set({ user: data.user, error: null, isAuthenticated: true });
      return data; // ✅ return for immediate use
    } catch (err) {
      set({ error: err.response?.data?.message || "Admin login failed" });
      throw err;
    }
  },

  userLogin: async (normalizedEmail, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/login`, {
        email: normalizedEmail,
        password,
      });

      const data = response.data;
      set({ user: data.user, error: null, isAuthenticated: true });
      return data; // ✅ return for immediate use
    } catch (err) {
      set({ error: err.response?.data?.message || "User login failed" });
      throw err;
    }
  },

  logout: async () => {
    const response = await axios.post(`${backendUrl}/api/users/logout`);
    set({ user: null, error: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${backendUrl}/api/users/checkAuth`);

      set({
        error: null,
        user: response.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      console.log(error.message);
    }
  },
}));

export default useAuthStore;
