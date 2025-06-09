import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

const AddUser = () => {
  // Form data state with fullName added
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    sector: "",
    subsector: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Checkboxes state to enable sector/subsector selection
  const [useSector, setUseSector] = useState(false);
  const [useSubsector, setUseSubsector] = useState(false);

  // Dropdown options
  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  const [filteredSubsectors, setFilteredSubsectors] = useState([]);

  // Error message
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch sectors and subsectors
  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes] = await Promise.all([
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
      ]);
      setSectors(sectorRes.data?.data || []);
      setSubsectors(subsectorRes.data || []);
    } catch (error) {
      console.error("Failed to fetch sectors/subsectors:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Filter subsectors when sector changes or useSector toggled off
  useEffect(() => {
    if (!useSector || !formData.sector) {
      setFilteredSubsectors([]);
      setFormData((prev) => ({ ...prev, subsector: "" }));
      setUseSubsector(false); // Disable subsector if sector not used
      return;
    }
    // Filter subsectors by selected sector
    const filtered = subsectors.filter((sub) => {
      if (!sub.sectorId) return false;
      const sectorIdFromSub =
        typeof sub.sectorId === "object" ? sub.sectorId._id || sub.sectorId : sub.sectorId;
      return sectorIdFromSub === formData.sector;
    });
    setFilteredSubsectors(filtered);
    // Reset subsector selection if out of filtered list
    if (!filtered.find((sub) => sub._id === formData.subsector)) {
      setFormData((prev) => ({ ...prev, subsector: "" }));
      setUseSubsector(false);
    }
  }, [formData.sector, subsectors, useSector]);

  // Handle input/select changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (id === "useSector") {
        setUseSector(checked);
        if (!checked) {
          setFormData((prev) => ({ ...prev, sector: "", subsector: "" }));
          setUseSubsector(false);
        }
      } else if (id === "useSubsector") {
        setUseSubsector(checked);
        if (!checked) {
          setFormData((prev) => ({ ...prev, subsector: "" }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    setErrorMsg("");
  };

  // Basic email format validation
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Password strength validation (min 6 chars here, can be adjusted)
  const isStrongPassword = (password) => {
    return password.length >= 6;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validations
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter full name.");
      return;
    }
    if (!formData.role) {
      setErrorMsg("Please select a role.");
      return;
    }
    if (!formData.email) {
      setErrorMsg("Please enter an email.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setErrorMsg("Please enter a password.");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    // Sector/Subsector validation based on checkboxes
    if (useSector && !formData.sector) {
      setErrorMsg("Please select a sector or uncheck the sector option.");
      return;
    }
    if (useSubsector && !formData.subsector) {
      setErrorMsg("Please select a subsector or uncheck the subsector option.");
      return;
    }

    // Prepare payload
    const payload = {
      fullName: formData.fullName,
      role: formData.role,
      email: formData.email,
      password: formData.password,
      sector: useSector ? formData.sector || null : null,
      subsector: useSubsector ? formData.subsector || null : null,
    };

    try {
      await axios.post(`${backendUrl}/api/users/create`, payload);
      alert("User created successfully!");
      // Reset form
      setFormData({
        fullName: "",
        role: "",
        sector: "",
        subsector: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setUseSector(false);
      setUseSubsector(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Failed to create user due to server error.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add User</h2>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            placeholder="John Doe"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="block mb-1 font-medium">
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          >
            <option value="">Select Role</option>
            <option value="Chief CEO">Chief CEO</option>
            <option value="CEO">CEO</option>
            <option value="Worker">Worker</option>
            <option value="System Admin">System Admin</option>
            <option value="Minister">Minister</option>
            <option value="Strategic Unit">Strategic Unit</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            placeholder="user@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>

        {/* Use Sector Checkbox */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="useSector"
            checked={useSector}
            onChange={handleChange}
            className="form-checkbox"
          />
          <label htmlFor="useSector" className="font-medium">
            Assign Sector
          </label>
        </div>

        {/* Sector select */}
        <div className="mb-4">
          <label
            htmlFor="sector"
            className={`block mb-1 font-medium ${!useSector ? "text-gray-400" : ""}`}
          >
            Sector
          </label>
          <select
            id="sector"
            value={formData.sector}
            onChange={handleChange}
            disabled={!useSector}
            className={`border border-gray-300 rounded-md px-4 py-2 w-full ${
              !useSector ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Sector</option>
            {sectors.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.sector_name}
              </option>
            ))}
          </select>
        </div>

        {/* Use Subsector Checkbox */}
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="useSubsector"
            checked={useSubsector}
            onChange={handleChange}
            disabled={!useSector}
            className="form-checkbox"
          />
          <label
            htmlFor="useSubsector"
            className={`font-medium ${!useSector ? "text-gray-400" : ""}`}
          >
            Assign Subsector
          </label>
        </div>

        {/* Subsector select */}
        <div className="mb-4">
          <label
            htmlFor="subsector"
            className={`block mb-1 font-medium ${
              !useSubsector || !useSector ? "text-gray-400" : ""
            }`}
          >
            Subsector
          </label>
          <select
            id="subsector"
            value={formData.subsector}
            onChange={handleChange}
            disabled={!useSubsector || !useSector}
            className={`border border-gray-300 rounded-md px-4 py-2 w-full ${
              !useSubsector || !useSector ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Subsector</option>
            {filteredSubsectors.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subsector_name}
              </option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 text-red-600 font-medium">{errorMsg}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
