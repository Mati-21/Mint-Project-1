import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

export default function PasswordManager() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all users for search
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/users/get-users`, { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // Filter users by search
  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Select user to update password
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  // Update password
  const handleUpdatePassword = async () => {
    setMessage("");
    if (!newPassword || !confirmPassword) {
      setMessage("Please enter and confirm the new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password should be at least 6 characters.");
      return;
    }
    try {
      await axios.put(
        `${backendUrl}/api/users/update-password/${selectedUser._id}`,
        { password: newPassword },
        { withCredentials: true }
      );
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("Failed to update password.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4">
        <input
          className="border px-3 py-1 rounded w-full"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* User list */}
      {!selectedUser && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filtered.slice(0, 10).map((u) => (
            <div
              key={u._id}
              className="p-3 bg-gray-50 rounded shadow flex justify-between items-center cursor-pointer hover:bg-blue-50"
              onClick={() => handleSelectUser(u)}
            >
              <div>
                <div className="font-semibold">{u.fullName}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
              <div className="text-xs text-gray-400">{u.role}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400">No users found.</div>
          )}
        </div>
      )}

      {/* User card and password update */}
      {selectedUser && (
        <div className="bg-white rounded shadow p-6 mt-4">
          <div className="mb-2 text-lg font-bold">{selectedUser.fullName}</div>
          <div className="mb-1 text-sm text-gray-600">{selectedUser.email}</div>
          <div className="mb-1 text-sm">Role: {selectedUser.role}</div>
          <div className="mb-1 text-sm">
            Sector: {selectedUser.sector?.sector_name || "-"}
          </div>
          <div className="mb-4 text-sm">
            Subsector: {selectedUser.subsector?.subsector_name || "-"}
          </div>
          <div className="mb-2">
            <input
              type="password"
              className="border px-3 py-1 rounded w-full mb-2"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="border px-3 py-1 rounded w-full"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {message && (
            <div
              className={`mb-2 text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}