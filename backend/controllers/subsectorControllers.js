
import sectorModel from "../models/sectorModel.js";
import Subsector from "../models/subsectorModel.js";

export const addSubsector = async (req, res) => {
  try {
    const { subsector_name, sectorId } = req.body;

    // Debug logs
    console.log("Incoming request to add Subsector:");
    console.log("subsector_name:", subsector_name);
    console.log("sectorId:", sectorId);

    if (!subsector_name || !sectorId) {
      return res
        .status(400)
        .json({ error: "subsector_name and sectorId are required" });
    }

    const existingSector = await sectorModel.findById(sectorId);

    if (!existingSector) {
      return res
        .status(404)
        .json({ error: "Sector not found with the provided sectorId." });
    }

    const newSubsector = new Subsector({
      sectorId,
      subsector_name,
    });
    await newSubsector.save();

    // Debug log for created subsector
    console.log("Subsector created:", newSubsector);

    res.status(201).json({
      message: "Subsector added successfully",
      data: newSubsector,
    });
  } catch (err) {
    console.error("Error creating Subsector:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAllSubsectors = async (req, res) => {
  try {
    const subsectors = await Subsector.find().populate("sectorId");
    res.json(subsectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
