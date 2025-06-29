import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../store/auth.store";
import { taskAssignStore } from "../../../store/taskAssignStore";
import { flattenAssignedKpis } from "../../../utils/flattenAssignedKpis";
import { toast } from "react-toastify";

export default function AddMeasure() {
  const [selectedKpiId, setSelectedKpiId] = useState("");
  const [measure, setMeasure] = useState("");
  const [kpiData, setKpiData] = useState([]);

  const { user } = useAuthStore();
  const subSectorId = user?.subsector?._id;

  const { fetchKpi, fetchMeasures } = taskAssignStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!subSectorId) return;
      try {
        const data = await fetchKpi(subSectorId);
        console.log(data.data);
        const result = flattenAssignedKpis(data.data);
        console.log(result);
        setKpiData(result);
      } catch (error) {
        console.error("Error fetching KPIs:", error.message);
      }
    };

    fetchData();
  }, [fetchKpi, subSectorId]);

  // const AllKpi = kpiData.map((data) => data.kpi);

  const addMeasure = async () => {
    if (!selectedKpiId || !measure.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:1221/api/measures/addMeasure",
        {
          kpi_id: selectedKpiId,
          measure_name: measure.trim(),
        }
      );

      toast.success("Measure Added Successfully");
      setMeasure("");
    } catch (error) {
      console.error(
        "Error adding measure:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Add Measures to KPI</h3>

      <select
        value={selectedKpiId}
        onChange={(e) => setSelectedKpiId(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select KPI</option>
        {kpiData.map((k) => (
          <option key={k.kpi_id} value={k.kpi_id}>
            {k.kpi_name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter Measure (e.g., Survey Score)"
        value={measure}
        onChange={(e) => setMeasure(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <button
        onClick={addMeasure}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Measure
      </button>
    </div>
  );
}
