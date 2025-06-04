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
  const [filteredKpis, setFilteredKpis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch dropdown data
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
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  // Fetch assigned KPIs
  const fetchAssignedKPIs = async (sectorId) => {
    try {
      if (sectorId) {
        const res = await axios.get(`${backendUrl}/api/assign/sector/${sectorId}`);
        setAssignedKPIs(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await axios.get(`${backendUrl}/api/assign/assigned-kpi`);
        setAssignedKPIs(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch assigned KPIs:", error);
      setAssignedKPIs([]);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchAssignedKPIs();
  }, []);

  // Update subsectors when sector changes
  useEffect(() => {
    if (!formData.sector) {
      setFilteredSubsectors([]);
      setFormData((prev) => ({ ...prev, subsector: "" }));
      fetchAssignedKPIs();
      return;
    }
    const filtered = subsectors.filter((sub) => {
      if (!sub.sectorId) return false;
      const subSectorId =
        typeof sub.sectorId === "object"
          ? sub.sectorId._id || sub.sectorId
          : sub.sectorId;
      return subSectorId === formData.sector;
    });
    setFilteredSubsectors(filtered);
    setFormData((prev) => ({ ...prev, subsector: "" }));
    fetchAssignedKPIs(formData.sector);
  }, [formData.sector, subsectors]);

  // Filter KPIs by selected KRA
  useEffect(() => {
    if (!formData.kra) {
      setFilteredKpis([]);
      setFormData((prev) => ({ ...prev, kpi: "" }));
      return;
    }
    const filtered = kpis.filter((kpi) => kpi.kra?.kra_id === formData.kra);
    setFilteredKpis(filtered);
  }, [formData.kra, kpis]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "sector") {
      setFormData((prev) => ({ ...prev, sector: value, subsector: "" }));
    } else if (id === "subsector") {
      setFormData((prev) => ({ ...prev, subsector: value }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.kra || !formData.kpi) {
      setErrorMsg("Please select both KRA and KPI.");
      return;
    }
    if (!formData.sector && !formData.subsector) {
      setErrorMsg("Please select either a Sector or a Subsector.");
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/assign/assign-kpi`, {
        sector: formData.subsector ? null : formData.sector || null,
        subsector: formData.subsector || null,
        kra: formData.kra,
        kpi: formData.kpi,
      });
      alert("KPI assigned successfully!");
      fetchAssignedKPIs(formData.sector || null);
      setFormData({ sector: "", subsector: "", kra: "", kpi: "" });
    } catch (error) {
      console.error("Failed to assign KPI:", error);
      if (error.response?.status === 409) {
        setErrorMsg("This KPI is already assigned to the selected Sector/Subsector.");
      } else if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Failed to assign KPI due to server error.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to unassign this KPI?")) return;

    try {
      await axios.delete(`${backendUrl}/api/assign/unassign-kpi/${id}`);
      alert("KPI unassigned successfully.");
      fetchAssignedKPIs(formData.sector || null);
    } catch (error) {
      console.error("Failed to unassign KPI:", error);
      alert("Failed to unassign KPI.");
    }
  };

  const filteredAssignedKPIs = assignedKPIs.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.kpiId?.kpi_name?.toLowerCase().includes(term) ||
      item.kraId?.kra_name?.toLowerCase().includes(term) ||
      item.sectorId?.sector_name?.toLowerCase().includes(term) ||
      item.subsectorId?.subsector_name?.toLowerCase().includes(term)
    );
  });

  const renderSelect = (id, label, options) => {
    let valueKey = "name";
    let labelKey = "name";

    switch (id) {
      case "sector":
        valueKey = "_id";
        labelKey = "sector_name";
        break;
      case "subsector":
        valueKey = "_id";
        labelKey = "subsector_name";
        break;
      case "kra":
        valueKey = "_id";
        labelKey = "kra_name";
        break;
      case "kpi":
        valueKey = "kpi_id";
        labelKey = "kpi_name";
        break;
      default:
        break;
    }

    const isDisabled = id === "subsector" && !formData.sector;

    return (
      <div className="flex flex-col mb-4">
        <label htmlFor={id} className="mb-1 font-medium capitalize">
          {label}
          {id === "subsector" && " (Optional)"}
        </label>
        <select
          id={id}
          value={formData[id] || ""}
          onChange={handleChange}
          required={id === "kra" || id === "kpi"}
          disabled={isDisabled}
          className={`border border-gray-300 rounded-md px-4 py-2 ${
            isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="">
            {id === "subsector" && !formData.sector
              ? "Select Sector first"
              : `Select ${label}`}
          </option>
          {options.map((opt) => (
            <option key={opt[valueKey]} value={opt[valueKey]}>
              {opt[labelKey]}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Assign KPI to Sector/Subsector</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        {renderSelect("sector", "Sector", sectors)}

        {renderSelect("subsector", "Subsector", filteredSubsectors)}

        {renderSelect("kra", "KRA", kras)}
        {renderSelect("kpi", "KPI", filteredKpis)}

        {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
        >
          Assign KPI
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search assigned KPIs..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Sector</th>
            <th className="border px-4 py-2">Subsector</th>
            <th className="border px-4 py-2">KRA</th>
            <th className="border px-4 py-2">KPI</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignedKPIs.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No assigned KPIs found.
              </td>
            </tr>
          )}

          {filteredAssignedKPIs.map((item) => (
            <tr key={item._id || item.id}>
              <td className="border px-4 py-2">
                {item.subsectorId
                  ? (() => {
                      const subsectorObj = subsectors.find(
                        (sub) => sub._id === item.subsectorId._id
                      );
                      const sectorObj = subsectorObj
                        ? sectors.find(
                            (sec) =>
                              sec._id ===
                              (typeof subsectorObj.sectorId === "object"
                                ? subsectorObj.sectorId._id
                                : subsectorObj.sectorId)
                          )
                        : null;
                      return sectorObj?.sector_name || "-";
                    })()
                  : item.sectorId?.sector_name || "-"}
              </td>
              <td className="border px-4 py-2">
                {item.subsectorId?.subsector_name || "-"}
              </td>
              <td className="border px-4 py-2">{item.kraId?.kra_name || "-"}</td>
              <td className="border px-4 py-2">{item.kpiId?.kpi_name || "-"}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  className="text-red-600 hover:underline"
                  title="Unassign KPI"
                >
                  Unassign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KpiAssignment;
