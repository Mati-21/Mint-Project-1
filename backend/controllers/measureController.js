import Measure from "../models/Measure.js";

// Add one measure to a KPI
export const addMeasure = async (req, res) => {
  try {
    const { kpi_id, measure_name } = req.body;

    if (!kpi_id || !measure_name?.trim()) {
      return res
        .status(400)
        .json({ message: "KPI ID and measure name are required" });
    }

    // Optional: prevent duplicate measures for the same KPI
    const existing = await Measure.findOne({
      kpi_id,
      measure_name: measure_name.trim(),
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Measure already exists for this KPI" });
    }

    const measure = new Measure({ kpi_id, measure_name: measure_name.trim() });
    await measure.save();

    res.status(201).json({ message: "Measure added", data: measure });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all measures for a KPI
export const getMeasuresByKpi = async (req, res) => {
  try {
    const { kpi_id } = req.params;
    const measures = await Measure.find({ kpi_id });
    res.status(200).json({ data: measures });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch measures", error: err.message });
  }
};

export const addNewAssignment = async () => {};
