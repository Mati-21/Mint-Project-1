import Performance from '../models/performanceModel.js';
import mongoose from 'mongoose';

// Fetch all performances with populated references
export const getAllPerformances = async (req, res) => {
  console.log("==== /api/performance GET called ====");
  try {
    const { year, quarter, sectorId, subsectorId } = req.query;
    const role = req.user?.role || "";
    const userSectorId = req.user?.sectorId;
    const userSubsectorId = req.user?.subsectorId;

    const filter = {};
    if (year) filter.year = String(year);
    if (quarter && quarter !== "year") {
      filter[`${quarter}Performance.value`] = { $ne: null };
    } else if (quarter === "year") {
      filter.performanceYear = { $ne: null };
    }

    // Role-based access filtering
    if (role === 'CEO') {
      filter.subsectorId = userSubsectorId;
    } else if (role === 'Chief CEO') {
      filter.sectorId = userSectorId;
    } else if (sectorId) {
      filter.sectorId = sectorId;
    }
    if (subsectorId) {
      filter.subsectorId = subsectorId;
    }

    console.log("Raw query params:", req.query);
    console.log("MongoDB filter object:", filter);

    const performances = await Performance.find(filter)
      .populate('sectorId', 'name')
      .populate('subsectorId', 'name')
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

// PATCH validation
export const validatePerformance = async (req, res) => {
  console.log("==== [PATCH] /api/performance-validation/validate/:id called ====");
  try {
    const { id } = req.params;
    const { type, status, description, role: clientRole } = req.body;

    const role = req.user?.role || clientRole || "";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid performance ID.' });
    }

    const allowedTypes = ['year', 'q1', 'q2', 'q3', 'q4'];
    const allowedStatuses = ['Approved', 'Rejected', 'Pending'];

    if (!allowedTypes.includes(type) || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid type or status.' });
    }

    // Determine which field set to update based on role
    let fieldPrefix = '';
    if (role === 'CEO') fieldPrefix = 'ceoValidation';
    else if (role === 'Chief CEO') fieldPrefix = 'chiefCeoValidation';
    else if (role === 'Strategic Unit') fieldPrefix = 'strategicValidation';
    else if (role === 'Minister') fieldPrefix = 'validationStatus';
    else return res.status(403).json({ message: 'Unauthorized role for validation.' });

    const statusField = type === 'year'
      ? `${fieldPrefix}Year`
      : `${fieldPrefix}${type.toUpperCase()}`;
    const descField = type === 'year'
      ? `${fieldPrefix}DescriptionYear`
      : `${fieldPrefix}Description${type.toUpperCase()}`;

    const update = {
      [statusField]: status,
      [descField]: description || '',
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
