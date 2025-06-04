import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:1221";

const KpiAssignment = () => {
  const [formData, setFormData] = useState({
    sector: "",
    subsector: "",
    kra: "",
    kpi: "",
  });

  const [assignedKPIs, setAssignedKPIs] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [subsectors, setSubsectors] = useState([]);
  const [kras, setKras] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [filteredSubsectors, setFilteredSubsectors] = useState([]);

  const fetchDropdownData = async () => {
    try {
      const [sectorRes, subsectorRes, kraRes, kpiRes] = await Promise.all([
        axios.get(`${backendUrl}/api/sector/get-sector`),
        axios.get(`${backendUrl}/api/subsector/get-subsector`),
        axios.get(`${backendUrl}/api/kras2/get-kra2`),
        axios.get(`${backendUrl}/api/kpis2/all2`),
      ]);

      setSectors(sectorRes.data?.data || []);
      setSubsectors(subsectorRes.data || []);
      setKras(kraRes.data || []);
      setKpis(kpiRes.data?.data || []);
      console.log("Fetched KPIs:", kpiRes.data?.data);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  const fetchAssignedKPIs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/kpis2/assigned-kpi`);
      setAssignedKPIs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch assigned KPIs:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAssignedKPIs();
  }, []);

  useEffect(() => {
    if (!formData.sector) {
      setFilteredSubsectors([]);
      return;
    }
    const selectedSector = sectors.find(s => s.sector_name === formData.sector);
    if (!selectedSector) {
      setFilteredSubsectors([]);
      return;
    }

    const sectorId = selectedSector._id;
    const filtered = subsectors.filter(sub => {
      if (!sub.sectorId) return false;
      const subSectorId =
        typeof sub.sectorId === "object" ? sub.sectorId._id || sub.sectorId : sub.sectorId;
      return subSectorId === sectorId;
    });

    setFilteredSubsectors(filtered);
  }, [formData.sector, sectors, subsectors]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/assign/assign-kpi`, formData);
      alert("KPI assigned successfully!");
      fetchAssignedKPIs();
      setFormData({ sector: "", subsector: "", kra: "", kpi: "" });
    } catch (error) {
      console.error("Failed to assign KPI:", error);
      alert("Failed to assign KPI.");
    }
  };

  const renderSelect = (id, label, options) => {
    let valueKey = "name";
    let labelKey = "name";

    switch (id) {
      case "sector":
        valueKey = "sector_name";
        labelKey = "sector_name";
        break;
      case "subsector":
        valueKey = "subsector_name";
        labelKey = "subsector_name";
        break;
      case "kra":
        valueKey = "kra_name";
        labelKey = "kra_name";
        break;
      case "kpi":
        valueKey = "kpi_name";
        labelKey = "kpi_name"; // Show human-readable name
        break;
      default:
        break;
    }

    return (
      <div className="flex flex-col mb-4">
        <label htmlFor={id} className="mb-1 font-medium capitalize">{label}</label>
        <select
          id={id}
          value={formData[id] || ""}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Select {label}</option>
          {Array.isArray(options) &&
            options.map((opt, idx) => {
              const val = opt?.[valueKey];
              const lbl = opt?.[labelKey];
              if (!val || !lbl) return null;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
        </select>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          KPI Assignment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderSelect("sector", "Sector", sectors)}
          {renderSelect("subsector", "Subsector", filteredSubsectors)}
          {renderSelect("kra", "KRA", kras)}
          {renderSelect("kpi", "KPI", kpis)}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Assign KPI
          </button>
        </form>
      </div>

      <div className="mt-10 max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All KPIs</h3>
        <table className="min-w-full table-auto border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">KPI Name</th>
              <th className="border p-2">KRA ID</th>
              <th className="border p-2">Goal ID</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((kpi, index) => (
              <tr key={index}>
                <td className="border p-2">{kpi.kpi_name}</td>
                <td className="border p-2">{kpi.kraId}</td>
                <td className="border p-2">{kpi.goalId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KpiAssignment;
