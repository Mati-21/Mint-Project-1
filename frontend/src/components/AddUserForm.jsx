import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const backendUrl = "http://localhost:1221";

const AddUserForm = () => {
  const navigate = useNavigate();

  const sectors = [
    "Innovation and research",
    "ICT and Digital economy",
    "Affiliated institutions",
    "Minister office",
    "Admin issues",
  ];

  const initialFormState = {
    username: "",
    email: "",
    city: "",
    phone: "",
    password: "",
    role: "",
    sector: "",
    subSector: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/user/add-user`, formData);
      const data = res.data;

      if (data.success) {
        toast.success("User registration successful!");
        localStorage.setItem("aToken", data.token);
        setFormData(initialFormState);
        setTimeout(() => navigate("/admin"), 3000);
      } else {
        setError(data.message || "Registration failed.");
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transform max-w-3xl w-full mx-auto p-8 bg-white shadow-lg rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New User
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <InputField
            label="Full Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />

          {/* Two-column section */}
          <div className="flex flex-wrap -mx-2">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              half
            />
            <SelectField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                "admin",
                "strategic",
                "minister",
                "executive",
                "workunit",
              ]}
              required
              half
            />
            <SelectField
              label="Sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              options={sectors}
              required
              half
            />
            <SelectField
              label="Sub-Sector"
              name="subSector"
              value={formData.subSector}
              onChange={handleChange}
              options={sectors}
              required
              half
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              half
            />
            <InputField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              half
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg transition-colors mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Add User"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUserForm;

// Reusable Input Field Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  half = false,
}) => (
  <div className={`w-full ${half ? "md:w-1/2" : ""} px-2 mt-4`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

// Reusable Select Field Component
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  half = false,
}) => (
  <div className={`w-full ${half ? "md:w-1/2" : ""} px-2 mt-4`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);
