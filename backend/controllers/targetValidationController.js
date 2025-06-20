import Plan from '../models/planModels.js';
import mongoose from 'mongoose';

// Map roles to their validation fields
const roleValidationFields = {
  ceo: {
    statusYear: 'ceoValidationYear',
    statusQ1: 'ceoValidationQ1',
    statusQ2: 'ceoValidationQ2',
    statusQ3: 'ceoValidationQ3',
    statusQ4: 'ceoValidationQ4',
    descYear: 'ceoValidationDescriptionYear',
    descQ1: 'ceoValidationDescriptionQ1',
    descQ2: 'ceoValidationDescriptionQ2',
    descQ3: 'ceoValidationDescriptionQ3',
    descQ4: 'ceoValidationDescriptionQ4',
  },
  'chief ceo': {
    statusYear: 'chiefCeoValidationYear',
    statusQ1: 'chiefCeoValidationQ1',
    statusQ2: 'chiefCeoValidationQ2',
    statusQ3: 'chiefCeoValidationQ3',
    statusQ4: 'chiefCeoValidationQ4',
    descYear: 'chiefCeoValidationDescriptionYear',
    descQ1: 'chiefCeoValidationDescriptionQ1',
    descQ2: 'chiefCeoValidationDescriptionQ2',
    descQ3: 'chiefCeoValidationDescriptionQ3',
    descQ4: 'chiefCeoValidationDescriptionQ4',
  },
  'strategic unit': {
    statusYear: 'strategicValidationYear',
    statusQ1: 'strategicValidationQ1',
    statusQ2: 'strategicValidationQ2',
    statusQ3: 'strategicValidationQ3',
    statusQ4: 'strategicValidationQ4',
    descYear: 'strategicValidationDescriptionYear',
    descQ1: 'strategicValidationDescriptionQ1',
    descQ2: 'strategicValidationDescriptionQ2',
    descQ3: 'strategicValidationDescriptionQ3',
    descQ4: 'strategicValidationDescriptionQ4',
  },
  minister: {
    statusYear: 'validationStatusYear',
    statusQ1: 'validationStatusQ1',
    statusQ2: 'validationStatusQ2',
    statusQ3: 'validationStatusQ3',
    statusQ4: 'validationStatusQ4',
    descYear: 'validationDescriptionYear',
    descQ1: 'validationDescriptionQ1',
    descQ2: 'validationDescriptionQ2',
    descQ3: 'validationDescriptionQ3',
    descQ4: 'validationDescriptionQ4',
  },
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate('sectorId', 'sector_name')
      .populate('subsectorId', 'subsector_name')
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

export const validateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    let { type, status, description, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plan ID.' });
    }

    type = type?.toLowerCase();
    role = role?.toLowerCase();

    const allowedTypes = ['year', 'q1', 'q2', 'q3', 'q4'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Must be one of year, q1, q2, q3, q4.' });
    }

    const allowedStatuses = ['Approved', 'Rejected', 'Pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved, Rejected, or Pending.' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Role is required for validation.' });
    }

    const fields = roleValidationFields[role];
    if (!fields) {
      return res.status(400).json({ message: `No validation fields configured for role: ${role}` });
    }

    const statusField = type === 'year' ? fields.statusYear : fields[`status${type.toUpperCase()}`];
    const descField = type === 'year' ? fields.descYear : fields[`desc${type.toUpperCase()}`];

    if (!statusField || !descField) {
      return res.status(400).json({ message: 'Validation fields not found for the given type.' });
    }

    const update = {
      [statusField]: status,
      [descField]: description || '',
    };

    const updatedPlan = await Plan.findByIdAndUpdate(id, update, { new: true })
      .populate('sectorId', 'sector_name')
      .populate('subsectorId', 'subsector_name')
      .populate('kpiId', 'kpi_name')
      .populate('kraId', 'kra_name')
      .populate('goalId', 'goal_desc');

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    return res.status(200).json(updatedPlan);
  } catch (error) {
    console.error('Error validating target:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
