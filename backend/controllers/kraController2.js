import KRA2 from "../models/kraModel2.js";
import Goal2 from "../models/goalModel2.js";

export const createKRA = async (req, res) => {
  try {
    const { kra_name, goalId } = req.body;

    // Debug log: print received data
    console.log("Incoming request to create KRA:");
    console.log("kra_name:", kra_name);
    console.log("goalId:", goalId);

    if (!kra_name || !goalId) {
      return res.status(400).json({ error: "kra_name and goalId are required" });
    }

    const goal = await Goal2.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found with provided goalId" });
    }

    const kra = new KRA2({ kra_name, goalId });
    await kra.save();

    // Debug log: confirm saved KRA
    console.log("KRA created:", kra);

    res.status(201).json({ message: "KRA created successfully", data: kra });
  } catch (err) {
    console.error("Error creating KRA:", err);
    res.status(500).json({ error: "Failed to create KRA", details: err.message });
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
