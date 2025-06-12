// controllers/targetValidationController.js
import Plan from '../models/planModels.js';
import mongoose from 'mongoose';

// Fetch all plans with populated references
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate('sectorId', 'name')       // populate only necessary fields for lighter payload
      .populate('subsectorId', 'name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc')
      .exec();

    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

// Update validation status and description only (for year or quarter)
export const validateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,        // one of: 'year', 'q1', 'q2', 'q3', 'q4'
      status,      // one of: 'Approved', 'Rejected', 'Pending'
      description, // validation comment for that period
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plan ID.' });
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

    const updatedPlan = await Plan.findByIdAndUpdate(id, update, { new: true });

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    return res.status(200).json(updatedPlan);
  } catch (error) {
    console.error('Error validating target:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
