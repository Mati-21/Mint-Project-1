import { useEffect, useState } from "react";
import axios from "axios";
import KpiTable from "./KpiTable";
const backendUrl = "http://localhost:1221";

const KpiAssignment = () => {
  const [formData, setFormData] = useState({
    sector: "",
    subsector: "",
    desk: "",
    kra: "",
    kpi: "",
  });

  const [assignedKPIs, setAssignedKPIs] = useState([]);

  // All options fetched from backend
  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  //const [desks, setDesks] = useState([]);
  const [kras, setKras] = useState([]);
  const [kpis, setKpis] = useState([]);

  // Filtered options based on selections
  const [filteredSubsectors, setFilteredSubsectors] = useState([]);
  const [filteredKpis, setFilteredKpis] = useState([]);

  // Fetch dropdown options
  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes, kraRes, kpiRes] =
        await Promise.all([
          axios.get(`${backendUrl}/api/sector/get-sector`),
          axios.get(`${backendUrl}/api/subsector/get-subsector`),
         // axios.get(`${backendUrl}/api/desk/get-desk`),
          axios.get(`${backendUrl}/api/kras/get-kra`), 
          axios.get(`${backendUrl}/api/kpis/get-kpi`),
        ]);

      setSectors(sectorRes.data);
      setSubsectors(subsectorRes.data);
      //setDesks(deskRes.data);
      setKras(kraRes.data);
      setKpis(kpiRes.data);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  const fetchAssignedKPIs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/kpis/get-kpi`);
      setAssignedKPIs(res.data);
    } catch (error) {
      console.error("Failed to fetch assigned KPIs:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAssignedKPIs();
  }, []);

  // Update filtered subsectors when sector changes
  useEffect(() => {
    if (!formData.sector) {
      setFilteredSubsectors([]);
      setFormData((prev) => ({ ...prev, subsector: "" }));
      return;
    }
    // Filter subsectors by sector
    const filtered = subsectors.filter(
      (sub) => sub.sectorName === formData.sector
    );
    setFilteredSubsectors(filtered);
    // Reset subsector if not in filtered list
    if (!filtered.find((s) => s.name === formData.subsector)) {
      setFormData((prev) => ({ ...prev, subsector: "" }));
    }
  }, [formData.sector, subsectors]);

  // Update filtered KPIs when KRA changes
  useEffect(() => {
    if (!formData.kra) {
      setFilteredKpis([]);
      setFormData((prev) => ({ ...prev, kpi: "" }));
      return;
    }
    // Filter KPIs by kra
    const filtered = kpis.filter((kpi) => kpi.kraName === formData.kra);
    setFilteredKpis(filtered);
    // Reset kpi if not in filtered list
    if (!filtered.find((k) => k.name === formData.kpi)) {
      setFormData((prev) => ({ ...prev, kpi: "" }));
    }
  }, [formData.kra, kpis]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/kpis/assign-kpi`, {
        sector: formData.sector,
        subsector: formData.subsector,
        // desk: formData.desk,
        kra: formData.kra,
        kpi: formData.kpi,    
      });
      fetchAssignedKPIs();
      alert("KPI assigned successfully!");
    } catch (error) {
      console.error("Failed to assign KPI:", error);
      alert("Failed to assign KPI.");
    }
  };

  // Helper to render select with passed options
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

            {/* Subsector dropdown filtered by sector */}
            {renderSelect("subsector", "Subsector", filteredSubsectors)}

            {renderSelect("desk", "Desk", desks)}
            {renderSelect("kra", "KRA", kras)}

            {/* KPI dropdown filtered by KRA */}
            {renderSelect("kpi", "KPI", filteredKpis)}

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
