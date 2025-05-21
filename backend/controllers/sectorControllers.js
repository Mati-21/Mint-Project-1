import Sector from '../models/sectorModel.js';

export const addSector = async (req, res) => {
  try {
    const { sector } = req.body;

  
    const newSector = new Sector({ sector});
    await newSector.save();

    res.status(201).json({ message: 'Sector added successfully', data: newSector });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.json(sectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
