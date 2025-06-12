import Performance from '../models/performanceModel.js';
import mongoose from 'mongoose';

// Fetch all performances with populated references
export const getAllPerformances = async (req, res) => {
  console.log("==== /api/performance GET called ===="); // Always prints
  try {
    const { year, quarter, sectorId, subsectorId } = req.query;
    const filter = {};
    if (year) filter.year = String(year);
    if (sectorId) filter.sectorId = sectorId;
    if (subsectorId) filter.subsectorId = subsectorId;
    if (quarter && quarter !== "year") {
      filter[`${quarter}Performance.value`] = { $ne: null };
    } else if (quarter === "year") {
      filter.performanceYear = { $ne: null };
    }

    // Print the raw query and the built filter
    console.log("Raw query params:", req.query);
    console.log("MongoDB filter object:", filter);

    const performances = await Performance.find(filter)
      .populate('sectorId')
      .populate('subsectorId')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc')
      .exec();

    console.log("Performances found:", performances.length);

    res.status(200).json(performances);
  } catch (error) {
    console.error('Error fetching performances:', error);
    res.status(500).json({ message: 'Failed to fetch performances' });
  }
};

// Update validation status and description only (for year or quarter)
export const validatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,        // one of: 'year', 'q1', 'q2', 'q3', 'q4'
      status,      // one of: 'Approved', 'Rejected', 'Pending'
      description, // validation comment for that period
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid performance ID.' });
    }

    const allowedTypes = ['year', 'q1', 'q2', 'q3', 'q4'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Must be one of year, q1, q2, q3, q4.' });
    }

    const allowedStatuses = ['Approved', 'Rejected', 'Pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved, Rejected, or Pending.' });
    }

    // Build dynamic field names for validation status and description
    const validationStatusField = type === 'year'
      ? 'validationStatusYear'
      : `validationStatus${type.toUpperCase()}`; // e.g. validationStatusQ1

    const validationDescriptionField = type === 'year'
      ? 'validationDescriptionYear'
      : `validationDescription${type.toUpperCase()}`; // e.g. validationDescriptionQ1

    const update = {
      [validationStatusField]: status,
      [validationDescriptionField]: description || '',
    };

    const updatedPerformance = await Performance.findByIdAndUpdate(id, update, { new: true });

    if (!updatedPerformance) {
      return res.status(404).json({ message: 'Performance not found.' });
    }

    return res.status(200).json(updatedPerformance);
  } catch (error) {
    console.error('Error validating performance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};