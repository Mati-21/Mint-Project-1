import { useEffect, useState } from "react";
import axios from "axios";
import KpiTable from "./KpiTable";

const KpiAssignment = () => {
  const [formData, setFormData] = useState({
    sector: "",
    subsector: "",
    desk: "",
    kra: "",
    kpi: "",
  });
  const [assignedKPIs, setAssignedKPIs] = useState([]);

  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  const [desks, setDesks] = useState([]);
  const [kras, setKras] = useState([]);
  const [kpis, setKpis] = useState([]);

  // Fetch dropdown options
  const fetchDropdownData = async () => {
    const [sectorRes, subsectorRes, deskRes, kraRes, kpiRes] =
      await Promise.all([
        axios.get("http://localhost:5000/api/sectors"),
        axios.get("http://localhost:5000/api/subsectors"),
        axios.get("http://localhost:5000/api/desks"),
        axios.get("http://localhost:5000/api/kras"),
        axios.get("http://localhost:5000/api/kpis/options"),
      ]);
    setSectors(sectorRes.data);
    setSubsectors(subsectorRes.data);
    setDesks(deskRes.data);
    setKras(kraRes.data);
    setKpis(kpiRes.data);
  };

  const fetchAssignedKPIs = async () => {
    const res = await axios.get("http://localhost:5000/api/kpis");
    setAssignedKPIs(res.data);
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAssignedKPIs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/kpis", formData);
    setFormData({ sector: "", subsector: "", desk: "", kra: "", kpi: "" });
    fetchAssignedKPIs();
  };

  const renderSelect = (id, label, options) => (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 font-medium capitalize">
        {label}:
      </label>
      <select
        id={id}
        value={formData[id]}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            KPI Assignment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderSelect("sector", "Sector", sectors)}
            {renderSelect("subsector", "Subsector", subsectors)}
            {renderSelect("desk", "Desk", desks)}
            {renderSelect("kra", "KRA", kras)}
            {renderSelect("kpi", "KPI", kpis)}

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Assign KPI
            </button>
          </form>
        </div>
      </div>
      <KpiTable assignedKPIs={assignedKPIs} />
    </>
  );
};

export default KpiAssignment;
