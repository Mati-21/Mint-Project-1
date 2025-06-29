import { useEffect, useState } from "react";
import axios from "axios";
import { taskAssignStore } from "../../../store/taskAssignStore";
import useAuthStore from "../../../store/auth.store";
import { flattenAssignedKpis } from "../../../utils/flattenAssignedKpis";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:1221";
const initialWorkers = ["Alice", "Bob", "Charlie", "Diana"];

export default function AssignTarget({ kpis, assignments, setAssignments }) {
  const { fetchKpi, fetchMeasuresByKpi } = taskAssignStore();
  const { user } = useAuthStore();

  const [listOfMeasure, setListOfMeasure] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState("");
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const [target, setTarget] = useState("");
  const [worker, setWorker] = useState({});
  const [year, setYear] = useState({});
  const [quarter, setQuarter] = useState({});
  const [subsectorUsers, setSubsectorUsers] = useState([]); // ✅ new state for users

  const subSectorId = user?.subsector?._id;

  useEffect(() => {
    const fetchData = async () => {
      if (!subSectorId) return;
      try {
        const data = await fetchKpi(subSectorId);
        console.log(data);
        const result = flattenAssignedKpis(data.data);
        console.log(result);
        setKpiData(result);
      } catch (error) {
        console.log("KPI fetch error:", error.message);
      }
    };

    fetchData();
  }, [fetchKpi, subSectorId]);

  useEffect(() => {
    const fetchMeasures = async () => {
      if (!selectedKpi) {
        setListOfMeasure([]);
        return;
      }

      try {
        const measures = await fetchMeasuresByKpi(selectedKpi);
        setListOfMeasure(measures);
      } catch (error) {
        console.error("Failed to fetch measures:", error.message);
      }
    };

    fetchMeasures();
  }, [selectedKpi, fetchMeasuresByKpi]);

  // ✅ Fetch users based on subsector
  useEffect(() => {
    const fetchSubsectorUsers = async () => {
      if (!subSectorId) return;

      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/users/getsubsector-user/${subSectorId}`
        );
        setSubsectorUsers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch subsector users:", error.message);
      }
    };

    fetchSubsectorUsers();
  }, [subSectorId]);
  console.log(kpiData);
  console.log(selectedKpi);

  const assign = async () => {
    const val = parseFloat(target);
    const assignedUser = subsectorUsers.find((user) => user._id === worker);

    const selectedData = kpiData.find((data) => data.kpi_id === selectedKpi);

    if (!selectedKpi || !selectedMeasure || isNaN(val) || !worker) return;
    const newAssignment = {
      Kpi_Name: selectedData.kpi_name,
      Kpi_Id: selectedData.kpi_id,
      Kra_Name: selectedData.kra_name,
      Kra_Id: selectedData.kra_id,
      Goal_Name: selectedData.goal_desc,
      Goal_Id: selectedData.goal_id,
      measure: selectedMeasure,
      target: val,
      year,
      quarter,
      assignedUser, // ✅ This is now an object, not an array
      performed: false,
    };

    try {
      const res = await axios.post(
        `http://localhost:1221/api/measureAssignment/assign`,
        newAssignment
      );
      toast.success("Task Assigned Successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error || // from res.status(500)
        error.message || // fallback from axios itself
        "Something went wrong";

      toast.error(message);
    }

    setTarget("");
    setSelectedMeasure("");
    setSelectedKpi("");
    setWorker("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Assign Target to Worker</h3>

      <select
        value={selectedKpi}
        onChange={(e) => setSelectedKpi(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select KPI</option>
        {kpiData.map((k) => (
          <option key={k.kpi_id} value={k.kpi_id}>
            {k.kpi_name}
          </option>
        ))}
      </select>

      <select
        value={selectedMeasure}
        onChange={(e) => setSelectedMeasure(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Measure</option>
        {listOfMeasure.map((m) => (
          <option key={m._id} value={m.measure_name}>
            {m.measure_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={target}
        placeholder="Enter Target"
        onChange={(e) => setTarget(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <select
        value={worker}
        onChange={(e) => setWorker(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Worker</option>
        {subsectorUsers.length > 0
          ? subsectorUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName}
              </option>
            ))
          : initialWorkers.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Year</option>
        <option value="2015">2015</option>
        <option value="2016">2016</option>
        <option value="2017">2017</option>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
      </select>
      <select
        value={quarter}
        onChange={(e) => setQuarter(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Quarter</option>
        <option value="q1">Q1</option>
        <option value="q2">Q2</option>
        <option value="q3">Q3</option>
        <option value="q4">Q4</option>
      </select>

      <button
        onClick={assign}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Assign Target
      </button>
    </div>
  );
}
