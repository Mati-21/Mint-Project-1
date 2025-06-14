import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "./AddUserForm";
import ViewUsers from "./ViewUsers";
import PasswordManager from "./PasswordManager";

const BASE_URL = "http://localhost:1221";

const tabs = [
  { label: "Add User", key: "add" },
  { label: "View Users", key: "view" },
  { label: "Password Manager", key: "password" },
];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    role: "",
    sector: "",
    subsector: "",
    password: "",
    confirmPassword: "",
  });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [pwSearch, setPwSearch] = useState("");
  const [pwUser, setPwUser] = useState(null);
  const [pwNew, setPwNew] = useState("");
  const [pwResetMsg, setPwResetMsg] = useState("");
  const [activeTab, setActiveTab] = useState("add");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${BASE_URL}/api/users/get-users`);
    setUsers(res.data);
  };

  // --- Add User ---
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    if (
      !addForm.fullName ||
      !addForm.email ||
      !addForm.role ||
      !addForm.password ||
      addForm.password !== addForm.confirmPassword
    ) {
      setAddError("Please fill all fields and make sure passwords match.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/users/create`, addForm);
      setAddSuccess("User added!");
      setAddForm({
        fullName: "",
        email: "",
        role: "",
        sector: "",
        subsector: "",
        password: "",
        confirmPassword: "",
      });
      fetchUsers();
    } catch (err) {
      setAddError(err.response?.data?.message || "Error adding user");
    }
  };

  // --- Edit User ---
  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditForm({
      fullName: user.fullName,
      role: user.role,
      sector: user.sector?._id || user.sector || "",
      subsector: user.subsector?._id || user.subsector || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (userId) => {
    try {
      await axios.put(`${BASE_URL}/api/users/update/${userId}`, editForm);
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      alert("Error saving user");
    }
  };

  // --- Password Manager ---
  const handlePwSearch = (e) => {
    setPwSearch(e.target.value);
    setPwUser(null);
    setPwResetMsg("");
  };

  const handlePwFind = () => {
    const found = users.find(
      (u) =>
        u.fullName.toLowerCase().includes(pwSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(pwSearch.toLowerCase())
    );
    setPwUser(found || null);
    setPwResetMsg("");
  };

  const handlePwReset = async () => {
    if (!pwUser || !pwNew) return;
    try {
      await axios.post(`${BASE_URL}/api/users/reset-password`, {
        userId: pwUser._id,
        newPassword: pwNew,
      });
      setPwResetMsg("Password reset!");
      setPwNew("");
    } catch (err) {
      setPwResetMsg("Error resetting password");
    }
  };

  // --- Filtered users for search ---
  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Navbar */}
      <nav className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 -mb-px font-semibold border-b-2 transition
              ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && (
          <div className="mb-8 border p-4 rounded bg-gray-50">
            <AddUser />
          </div>
        )}
        {activeTab === "view" && <ViewUsers />}
        {activeTab === "password" && <PasswordManager />}
      </div>
    </div>
  );
}

export default UserManagement;
