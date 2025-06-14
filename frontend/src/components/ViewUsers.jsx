import { useEffect, useState } from "react";
import axios from "axios";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const backendUrl = "http://localhost:1221";
const ROWS_PER_PAGE = 10;

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  const [filteredSubsectors, setFilteredSubsectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users, sectors, and subsectors
  const fetchAll = async () => {
    try {
      const [usersRes, sectorRes, subsectorRes] = await Promise.all([
        axios.get(`${backendUrl}/api/users/get-users`, { withCredentials: true }),
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
      ]);
      setUsers(usersRes.data);
      setSectors(sectorRes.data?.data || []);
      setSubsectors(subsectorRes.data || []);
    } catch {
      setUsers([]);
      setSectors([]);
      setSubsectors([]);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Filter subsectors for edit dropdown
  useEffect(() => {
    if (!editData.sector) {
      setFilteredSubsectors([]);
      return;
    }
    const filtered = subsectors.filter((sub) => {
      if (!sub.sectorId) return false;
      const sectorIdFromSub =
        typeof sub.sectorId === "object"
          ? sub.sectorId._id || sub.sectorId
          : sub.sectorId;
      return sectorIdFromSub === editData.sector;
    });
    setFilteredSubsectors(filtered);
  }, [editData.sector, subsectors, editingId]);

  // Filtered users
  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // Start editing
  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      sector: user.sector?._id || "",
      subsector: user.subsector?._id || "",
    });
  };

  // Save edit
  const handleSave = async (userId) => {
    try {
      await axios.put(
        `${backendUrl}/api/users/update-user/${userId}`,
        editData,
        { withCredentials: true }
      );
      setEditingId(null);
      setEditData({});
      fetchAll();
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Handle edit input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "sector" ? { subsector: "" } : {}),
    }));
  };

  // Export to Excel
  const exportToExcel = (all = false) => {
    const data = (all ? filtered : paginated).map((u) => ({
      Name: u.fullName,
      Email: u.email,
      Role: u.role,
      Sector: u.sector?.sector_name || "",
      Subsector: u.subsector?.subsector_name || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "users.xlsx");
  };

  // Export to PDF
  const exportToPDF = (all = false) => {
    const doc = new jsPDF();
    const data = (all ? filtered : paginated).map((u) => [
      u.fullName,
      u.email,
      u.role,
      u.sector?.sector_name || "",
      u.subsector?.subsector_name || "",
    ]);
    autoTable(doc, {
      head: [["Name", "Email", "Role", "Sector", "Subsector"]],
      body: data,
    });
    doc.save("users.pdf");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          className="border px-3 py-1 rounded w-full md:w-1/3"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex gap-2">
          {/* Excel Page */}
          <div className="relative group">
            <button
              className="bg-white border border-green-600 px-3 py-1 rounded flex items-center"
              onClick={() => exportToExcel(false)}
              aria-label="Export page as Excel"
            >
              <FaFileExcel className="text-green-600 mr-1" size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
              Export to Excel, as page
            </span>
          </div>
          {/* Excel All */}
          <div className="relative group">
            <button
              className="bg-white border border-green-700 px-3 py-1 rounded flex items-center"
              onClick={() => exportToExcel(true)}
              aria-label="Export all as Excel"
            >
              <FaFileExcel className="text-green-700 mr-1" size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
              Export to Excel, as full
            </span>
          </div>
          {/* PDF Page */}
          <div className="relative group">
            <button
              className="bg-white border border-red-600 px-3 py-1 rounded flex items-center"
              onClick={() => exportToPDF(false)}
              aria-label="Export page as PDF"
            >
              <FaFilePdf className="text-red-600 mr-1" size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
              Export to PDF, as page
            </span>
          </div>
          {/* PDF All */}
          <div className="relative group">
            <button
              className="bg-white border border-red-700 px-3 py-1 rounded flex items-center"
              onClick={() => exportToPDF(true)}
              aria-label="Export all as PDF"
            >
              <FaFilePdf className="text-red-700 mr-1" size={20} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
              Export to PDF, as full
            </span>
          </div>
        </div>
      </div>
      <table className="w-full text-xs border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Sector</th>
            <th className="p-2 border">Subsector</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) =>
            editingId === u._id ? (
              <tr key={u._id} className="bg-yellow-50">
                <td className="p-2 border">
                  <input
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    className="border px-1 rounded w-full"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="border px-1 rounded w-full"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    name="role"
                    value={editData.role}
                    onChange={handleEditChange}
                    className="border px-1 rounded w-full"
                  >
                    <option value="">Select Role</option>
                    <option value="Chief CEO">Chief CEO</option>
                    <option value="CEO">CEO</option>
                    <option value="Worker">Worker</option>
                    <option value="System Admin">System Admin</option>
                    <option value="Minister">Minister</option>
                    <option value="Strategic Unit">Strategic Unit</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <select
                    name="sector"
                    value={editData.sector}
                    onChange={handleEditChange}
                    className="border px-1 rounded w-full"
                  >
                    <option value="">Select Sector</option>
                    {sectors.map((sec) => (
                      <option key={sec._id} value={sec._id}>
                        {sec.sector_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <select
                    name="subsector"
                    value={editData.subsector}
                    onChange={handleEditChange}
                    className="border px-1 rounded w-full"
                  >
                    <option value="">Select Subsector</option>
                    {filteredSubsectors.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subsector_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    className="text-green-600 mr-2"
                    onClick={() => handleSave(u._id)}
                  >
                    Save
                  </button>
                  <button className="text-gray-500" onClick={handleCancel}>
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={u._id}>
                <td className="p-2 border">{u.fullName}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">{u.sector?.sector_name || ""}</td>
                <td className="p-2 border">{u.subsector?.subsector_name || ""}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-4">No users found.</div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}