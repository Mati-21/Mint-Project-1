import sectorModel from "../models/sectorModel.js";
import Subsector from "../models/subsectorModel.js";

export const addSubsector = async (req, res) => {
  try {
    const { subsector_name } = req.body;

    const existingSector = await sectorModel.findOne();

    if (!existingSector) {
      return res
        .status(400)
        .json({ error: "No sector found. Please create a sector first." });
    }

    const newSubsector = new Subsector({
      sectorId: existingSector._id,
      subsector_name,
    });
    await newSubsector.save();

    res
      .status(201)
      .json({ message: "Subsector added successfully", data: subsector_name });
  } catch (err) {
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
