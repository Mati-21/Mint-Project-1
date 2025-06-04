import KpiAssignment from "../models/kpiAssignmentModel.js"; 
import sectorModel from "../models/sectorModel.js";
import subsectorModel from "../models/subsectorModel.js";
import KRA2 from "../models/kraModel2.js";
import KPI2 from "../models/kpiModel2.js";


export const assignKpi = async (req, res) => {
  try {
    const { sector, subsector, kra, kpi } = req.body;

    // Find the actual documents by name (or change this to use IDs if your frontend sends them)
    const sectorDoc = await sectorModel.findOne({ sector_name: sector });
    if (!sectorDoc) {
      return res.status(400).json({ error: "Sector not found" });
    }

    const subsectorDoc = await subsectorModel.findOne({ subsector_name: subsector });
    if (!subsectorDoc) {
      return res.status(400).json({ error: "Subsector not found" });
    }

    const kraDoc = await KRA2.findOne({ kra_name: kra });
    if (!kraDoc) {
      return res.status(400).json({ error: "KRA not found" });
    }

    const kpiDoc = await KPI2.findOne({ kpi_name: kpi });
    if (!kpiDoc) {
      return res.status(400).json({ error: "KPI not found" });
    }

    // Create assignment using IDs
    const newAssignment = new KpiAssignment({
      sectorId: sectorDoc._id,
      subsectorId: subsectorDoc._id,
      kraId: kraDoc._id,
      kpiId: kpiDoc._id,
    });

    await newAssignment.save();

    res.status(201).json({
      message: "KPI assigned successfully",
      data: newAssignment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllAssignedKpis = async (req, res) => {
  try {
    const assignedKpis = await KpiAssignment.find();
    res.json(assignedKpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignedKpis = async (req, res) => {
  const {id} = req.params
  console.log(id);

  try {
    const assignedKpis = await KpiAssignment.findOne({sectorId:id});
    console.log(assignedKpis);


    res.json(assignedKpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
