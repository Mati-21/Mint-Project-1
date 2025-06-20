import { create } from "zustand";
import axios from "axios";

const backendUrl = "http://localhost:1221";

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

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

  updateProfile: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(
        "http://localhost:1221/api/users/update-profile",
        formData
      );
      set({ user: res.data.user, isLoading: false, error: null });
      if (res.data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        "http://localhost:1221/api/users/get-profile",
        {
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.user) {
        set({ user: res.data.user, isLoading: false, error: null });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },
}));

export default useAuthStore;
