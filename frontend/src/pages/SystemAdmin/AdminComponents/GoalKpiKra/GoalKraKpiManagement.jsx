import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:1221/api";

function GoalKraKpiManagement() {
  const [activeTab, setActiveTab] = useState("add");
  const [goals, setGoals] = useState([]);
  const [kras, setKras] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // For editing
  const [editType, setEditType] = useState(null); // "goal" | "kra" | "kpi"
  const [editItem, setEditItem] = useState(null);

  // Search states
  const [goalSearch, setGoalSearch] = useState("");
  const [kraSearch, setKraSearch] = useState("");
  const [kpiSearch, setKpiSearch] = useState("");

  // Fetch all data
  useEffect(() => {
    // Fetch Goals
    axios.get(`${BASE_URL}/goal2/get-goal2`)
      .then(res => setGoals(res.data))
      .catch(() => setGoals([]));

    // Fetch KRAs
    axios.get(`${BASE_URL}/kras2/get-kra2`).then(res => { console.log(res.data); setKras(res.data); });

    // Fetch KPIs (note: .data.data for your backend structure)
    axios.get(`${BASE_URL}/kpis2/all2`).then(res => { console.log(res.data); setKpis(res.data.data || []); });
  }, [refresh]);

  // Add handlers
  const handleAddGoal = async (goal_desc) => {
    await axios.post(`${BASE_URL}/goal2/create-goal2`, { goal_desc });
    setRefresh(r => !r);
  };
  const handleAddKRA = async (kra_name, goalId) => {
    await axios.post(`${BASE_URL}/kra2/create-kra2`, { kra_name, goalId });
    setRefresh(r => !r);
  };
  const handleAddKPI = async (kpi_name, kraId, goalId) => {
    await axios.post(`${BASE_URL}/kpi2/create-kpi2`, { kpi_name, kraId, goalId });
    setRefresh(r => !r);
  };

  // Edit handlers
  const handleEdit = (type, item) => {
    setEditType(type);
    setEditItem(item);
  };
  const handleEditSave = async (type, item) => {
    if (type === "goal") {
      await axios.put(`${BASE_URL}/goal2/edit-goal2/${item._id}`, { goal_desc: item.goal_desc });
    } else if (type === "kra") {
      await axios.put(`${BASE_URL}/kra2/edit-kra2/${item._id}`, { kra_name: item.kra_name, goalId: item.goalId });
    } else if (type === "kpi") {
      await axios.put(`${BASE_URL}/kpi2/edit-kpi2/${item.kpi_id}`, { kpi_name: item.kpi_name, kraId: item.kra.kra_id, goalId: item.goal.goal_id });
    }
    setEditType(null);
    setEditItem(null);
    setRefresh(r => !r);
  };

  // Delete handlers
  const handleDelete = async (type, id) => {
    if (type === "goal") {
      await axios.delete(`${BASE_URL}/goal2/delete-goal2/${id}`);
    } else if (type === "kra") {
      await axios.delete(`${BASE_URL}/kra2/delete-kra2/${id}`);
    } else if (type === "kpi") {
      await axios.delete(`${BASE_URL}/kpi2/delete-kpi2/${id}`);
    }
    setRefresh(r => !r);
  };

  const filteredGoals = goals.filter(g =>
    (g.goal_desc || "").toLowerCase().includes(goalSearch.toLowerCase())
  );

  const filteredKras = kras.filter(k =>
    (k.kra_name || "").toLowerCase().includes(kraSearch.toLowerCase())
  );

  const filteredKpis = kpis.filter(k =>
    (k.kpi_name || "").toLowerCase().includes(kpiSearch.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Goal, KRA, KPI Management</h2>
      {/* Tabs */}
      <nav className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 -mb-px font-semibold border-b-2 transition ${
            activeTab === "add"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          Add Goal/KRA/KPI
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-2 -mb-px font-semibold border-b-2 transition ${
            activeTab === "view"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          View & Manage
        </button>
      </nav>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AddGoalCard onAdd={handleAddGoal} />
            <AddKRACard onAdd={handleAddKRA} goals={goals} />
            <AddKPICard onAdd={handleAddKPI} kras={kras} goals={goals} />
          </div>
        )}
        {activeTab === "view" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <input
                type="text"
                placeholder="Search Goals..."
                className="mb-2 w-full border rounded px-3 py-2"
                value={goalSearch}
                onChange={e => setGoalSearch(e.target.value)}
              />
              <ViewCard
                title="Goals"
                items={filteredGoals}
                type="goal"
                onEdit={handleEdit}
                onDelete={handleDelete}
                search={goalSearch}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search KRAs..."
                className="mb-2 w-full border rounded px-3 py-2"
                value={kraSearch}
                onChange={e => setKraSearch(e.target.value)}
              />
              <ViewCard
                title="KRAs"
                items={filteredKras}
                type="kra"
                onEdit={handleEdit}
                onDelete={handleDelete}
                goals={goals}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search KPIs..."
                className="mb-2 w-full border rounded px-3 py-2"
                value={kpiSearch}
                onChange={e => setKpiSearch(e.target.value)}
              />
              <ViewCard
                title="KPIs"
                items={filteredKpis}
                type="kpi"
                onEdit={handleEdit}
                onDelete={handleDelete}
                kras={kras}
                goals={goals}
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editType && (
        <EditModal
          type={editType}
          item={editItem}
          onClose={() => { setEditType(null); setEditItem(null); }}
          onSave={handleEditSave}
          goals={goals}
          kras={kras}
        />
      )}
    </div>
  );
}

// Add Goal Card
function AddGoalCard({ onAdd }) {
  const [goal, setGoal] = useState("");
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 border border-green-100">
      <h3 className="font-bold text-lg text-green-700">Add Goal</h3>
      <input
        className="border rounded px-3 py-2"
        placeholder="Goal description"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />
      <button
        className="bg-green-600 text-white rounded px-4 py-2 mt-2"
        onClick={() => { onAdd(goal); setGoal(""); }}
        disabled={!goal.trim()}
      >
        Add Goal
      </button>
    </div>
  );
}

// Add KRA Card
function AddKRACard({ onAdd, goals }) {
  const [kra, setKra] = useState("");
  const [goalId, setGoalId] = useState("");
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 border border-green-100">
      <h3 className="font-bold text-lg text-green-700">Add KRA</h3>
      <input
        className="border rounded px-3 py-2"
        placeholder="KRA name"
        value={kra}
        onChange={e => setKra(e.target.value)}
      />
      <select
        className="border rounded px-3 py-2"
        value={goalId}
        onChange={e => setGoalId(e.target.value)}
      >
        <option value="">Select Goal</option>
        {goals.map(g => (
          <option key={g._id} value={g._id}>{g.goal_desc}</option>
        ))}
      </select>
      <button
        className="bg-green-600 text-white rounded px-4 py-2 mt-2"
        onClick={() => { onAdd(kra, goalId); setKra(""); setGoalId(""); }}
        disabled={!kra.trim() || !goalId}
      >
        Add KRA
      </button>
    </div>
  );
}

// Add KPI Card
function AddKPICard({ onAdd, kras, goals }) {
  const [kpi, setKpi] = useState("");
  const [kraId, setKraId] = useState("");
  const [goalId, setGoalId] = useState("");
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 border border-green-100">
      <h3 className="font-bold text-lg text-green-700">Add KPI</h3>
      <input
        className="border rounded px-3 py-2"
        placeholder="KPI name"
        value={kpi}
        onChange={e => setKpi(e.target.value)}
      />
      <select
        className="border rounded px-3 py-2"
        value={goalId}
        onChange={e => setGoalId(e.target.value)}
      >
        <option value="">Select Goal</option>
        {goals.map(g => (
          <option key={g._id} value={g._id}>{g.goal_desc}</option>
        ))}
      </select>
      <select
        className="border rounded px-3 py-2"
        value={kraId}
        onChange={e => setKraId(e.target.value)}
        disabled={!goalId}
      >
        <option value="">Select KRA</option>
        {kras.filter(k => k.goalId === goalId || k.goalId?._id === goalId).map(k => (
          <option key={k._id} value={k._id}>{k.kra_name}</option>
        ))}
      </select>
      <button
        className="bg-green-600 text-white rounded px-4 py-2 mt-2"
        onClick={() => { onAdd(kpi, kraId, goalId); setKpi(""); setKraId(""); setGoalId(""); }}
        disabled={!kpi.trim() || !kraId || !goalId}
      >
        Add KPI
      </button>
    </div>
  );
}

// View Card
function ViewCard({ title, items, type, onEdit, onDelete, goals = [], kras = [], search, setSearch }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-green-100">
      <h3 className="font-bold text-lg text-green-700 mb-2">{title}</h3>
      <input
        className="border rounded px-3 py-2 w-full mb-4"
        placeholder={`Search ${title}`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.length === 0 && <div className="text-gray-400 text-sm">No {title} found.</div>}
        {items.filter(item => (item.goal_desc || "").toLowerCase().includes((search || "").toLowerCase())).map(item => (
          <div key={item._id || item.kpi_id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <div>
              {type === "goal" && <span>{item.goal_desc}</span>}
              {type === "kra" && (
                <>
                  <span>{item.kra_name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({item.goalId?.goal_desc || goals.find(g => g._id === item.goalId)?.goal_desc || "No Goal"})
                  </span>
                </>
              )}
              {type === "kpi" && (
                <>
                  <span>{item.kpi_name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({item.kra?.kra_name || kras.find(k => k._id === item.kra?.kra_id)?.kra_name || "No KRA"})
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="text-green-600 hover:underline"
                onClick={() => onEdit(type, item)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(type, item._id || item.kpi_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Edit Modal
function EditModal({ type, item, onClose, onSave, goals, kras }) {
  const [form, setForm] = useState({ ...item });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="font-bold text-lg mb-4 text-green-700">Edit {type.toUpperCase()}</h3>
        {type === "goal" && (
          <input
            className="border rounded px-3 py-2 w-full mb-4"
            value={form.goal_desc}
            onChange={e => setForm({ ...form, goal_desc: e.target.value })}
          />
        )}
        {type === "kra" && (
          <>
            <input
              className="border rounded px-3 py-2 w-full mb-2"
              value={form.kra_name}
              onChange={e => setForm({ ...form, kra_name: e.target.value })}
            />
            <select
              className="border rounded px-3 py-2 w-full mb-4"
              value={form.goalId}
              onChange={e => setForm({ ...form, goalId: e.target.value })}
            >
              <option value="">Select Goal</option>
              {goals.map(g => (
                <option key={g._id} value={g._id}>{g.goal_desc}</option>
              ))}
            </select>
          </>
        )}
        {type === "kpi" && (
          <>
            <input
              className="border rounded px-3 py-2 w-full mb-2"
              value={form.kpi_name}
              onChange={e => setForm({ ...form, kpi_name: e.target.value })}
            />
            <select
              className="border rounded px-3 py-2 w-full mb-2"
              value={form.goal?.goal_id || ""}
              onChange={e => setForm({ ...form, goal: { ...form.goal, goal_id: e.target.value } })}
            >
              <option value="">Select Goal</option>
              {goals.map(g => (
                <option key={g._id} value={g._id}>{g.goal_desc}</option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2 w-full mb-4"
              value={form.kra?.kra_id || ""}
              onChange={e => setForm({ ...form, kra: { ...form.kra, kra_id: e.target.value } })}
            >
              <option value="">Select KRA</option>
              {kras
                .filter(k => k.goalId === (form.goal?.goal_id || form.goalId))
                .map(k => (
                  <option key={k._id} value={k._id}>{k.kra_name}</option>
                ))}
            </select>
          </>
        )}
        <button
          className="bg-green-600 text-white rounded px-4 py-2 w-full"
          onClick={() => onSave(type, { ...item, ...form })}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default GoalKraKpiManagement;