import Plan from '../models/planModels.js';

export const createPlan = async (req, res) => {
  try {
    const { kpi_name, year, quarter, target, description } = req.body;
    const userId = req.user._id; 

    const newPlan = new Plan({ userId,kpi_name,  year, quarter, target, description });
    await newPlan.save();

    res.status(201).json({ message: 'Plan created successfully', data: newPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
