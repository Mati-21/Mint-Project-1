import Sector from "../models/sectorModel.js";

export const addSector = async (req, res) => {
  try {
    const { sector_name } = req.body;

    if (!sector_name) {
      return res.status(400).json({ error: "Sector name is required" });
    }

    // Optional: Check if sector already exists to prevent duplicates
    const existingSector = await Sector.findOne({ sector_name });
    if (existingSector) {
      return res.status(409).json({ error: "Sector already exists" });
    }

    const newSector = new Sector({ sector_name });
    await newSector.save();

    res
      .status(201)
      .json({ message: "Sector added successfully", data: newSector });
  } catch (err) {
    console.error("Add sector error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.json({ data: sectors });
  } catch (err) {
    console.error("Get sectors error:", err);
    res.status(500).json({ error: err.message });
  }
};
