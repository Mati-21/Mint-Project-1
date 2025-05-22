// ✅ backend/controllers/kpiController.js

import KRA2 from "../models/kraModel2.js";
import Goal2 from "../models/goalModel2.js";
import KPI2 from "../models/kpiModel2.js";

// ✅ Create KPI
export const createKPI = async (req, res) => {
  try {
    const { kpi_name, kraId, goalId } = req.body;

    if (!kpi_name || !kraId || !goalId) {
      return res
        .status(400)
        .json({ error: "kpi_name, kraId, and goalId are required" });
    }

    // Optional: Validate the existence of KRA and Goal
    const kraExists = await KRA2.findById(kraId);
    const goalExists = await Goal2.findById(goalId);

    if (!kraExists || !goalExists) {
      return res.status(404).json({ error: "Invalid kraId or goalId" });
    }

    const kpi = new KPI2({ kpi_name, kraId, goalId });
    await kpi.save();

    res.status(201).json({ message: "KPI created successfully", data: kpi });
  } catch (err) {
    console.error("Error creating KPI:", err);
    res
      .status(500)
      .json({ error: "Failed to create KPI", details: err.message });
  }
};

// ✅ Get All KPIs (with related KRA and Goal)
export const getAllKPIs = async (req, res) => {
  try {
    const kpis = await KPI2.find()
      .populate({
        path: "kraId",
        select: "kra_name goalId",
        populate: {
          path: "goalId",
          select: "goal_desc",
        },
      })
      .select("kpi_name kraId");

    const structuredData = kpis.map((kpi) => ({
      kpi_id: kpi._id,
      kpi_name: kpi.kpi_name,
      kra: {
        kra_id: kpi.kraId?._id,
        kra_name: kpi.kraId?.kra_name,
      },
      goal: {
        goal_id: kpi.kraId?.goalId?._id,
        goal_desc: kpi.kraId?.goalId?.goal_desc,
      },
    }));

    res.status(200).json({ success: true, data: structuredData });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch KPIs with related data",
      details: err.message,
    });
  }
};

// ✅ Get All KPI Data structured by Goal → KRA → KPI
export const getAllKPIData = async (req, res) => {
  try {
    const goals = await Goal2.find({}, "_id goal_desc");
    const kras = await KRA2.find({}, "_id kra_name goalId");
    const kpis = await KPI2.find({}, "_id kpi_name kraId");

    const result = goals.map((goal) => {
      const goalKras = kras.filter(
        (kra) => kra.goalId.toString() === goal._id.toString()
      );

      const structuredKras = goalKras.map((kra) => {
        const kraKpis = kpis.filter(
          (kpi) => kpi.kraId.toString() === kra._id.toString()
        );

        return {
          _id: kra._id,
          kra_name: kra.kra_name,
          kpis: kraKpis.map((kpi) => ({
            _id: kpi._id,
            kpi_name: kpi.kpi_name,
          })),
        };
      });

      return {
        _id: goal._id,
        goal_desc: goal.goal_desc,
        kras: structuredKras,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: "Failed to fetch goal-KRA-KPI data",
      details: err.message,
    });
  }
};
