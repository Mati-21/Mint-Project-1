import KRA2 from "../models/kraModel2.js";
import Goal2 from "../models/goalModel2.js";

export const createKRA = async (req, res) => {
  try {
    const { kra_name } = req.body;

    if (!kra_name) {
      return res.status(400).json({ error: "kra_name is required" });
    }

    const goal = await Goal2.findOne();

    if (!goal) {
      return res.status(404).json({ error: "No goal found in the database" });
    }

    const kra = new KRA2({ kra_name, goalId: goal._id });
    await kra.save();

    res.status(201).json({ message: "KRA created successfully", data: kra });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create KRA", details: err.message });
  }
};
export const getAllKRAs = async (req, res) => {
  try {
    const kras = await KRA2.find().populate("goalId");

    res.status(200).json(kras);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch KRAs", details: err.message });
  }
};
