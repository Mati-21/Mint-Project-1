import Performance from '../models/performanceModel.js';

// Create or update performance record
export const createOrUpdatePerformance = async (req, res) => {
  try {
    const {
      userId,
      kpiName,
      year,
      quarter, // optional: null or 'Q1', 'Q2', etc
      target,
      performanceMeasure,
      description,
      sectorId,
      subsectorId,
    } = req.body;

    if (!userId || !kpiName || !year) {
      return res.status(400).json({ message: "Missing required fields: userId, kpiName, or year." });
    }

    // Filter to find existing record
    const filter = {
      userId,
      kpiName,
      year,
      quarter: quarter || null,
      sectorId: sectorId || null,
      subsectorId: subsectorId || null,
    };

    const update = {
      target: target || '',
      performanceMeasure: performanceMeasure || '',
      description: description || '',
      createdAt: new Date(),
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const performance = await Performance.findOneAndUpdate(filter, update, options);

    return res.status(200).json({ message: "Performance saved successfully.", performance });
  } catch (error) {
    console.error("createOrUpdatePerformance error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get performance records by user (optionally filter by KPI, year, quarter)
export const getPerformances = async (req, res) => {
  try {
    const { userId, kpiName, year, quarter } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId." });
    }

    const filter = { userId };
    if (kpiName) filter.kpiName = kpiName;
    if (year) filter.year = year;
    if (quarter) filter.quarter = quarter;

    const performances = await Performance.find(filter).sort({ year: 1, quarter: 1 });

    return res.status(200).json(performances);
  } catch (error) {
    console.error("getPerformances error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
