import Assignment from "../models/measureAssignmentModel.js";

export const createOrUpdateAssignment = async (req, res) => {
  console.log("Dymanic");
  try {
    const {
      Kpi_Id,
      Kpi_Name,
      Kra_Id,
      Kra_Name,
      Goal_Id,
      Goal_Name,
      assignedUser,
      measure,
      target,
      year,
      quarter,
    } = req.body;

    // Check if assignment with the same KRA, KPI, Goal and user already exists
    let existing = await Assignment.findOne({
      "assignedUser._id": assignedUser._id,
      Kpi_Id,
      Kra_Id,
      Goal_Id,
    });
    console.log(existing);

    const newMeasureEntry = {
      measure,
      target,
      year,
      quarter,
      performed: false,
    };

    if (existing) {
      // Optional: Check if exact same measure already exists to avoid duplicates
      const alreadyExists = existing.measures.some(
        (m) => m.measure === measure && m.year === year && m.quarter === quarter
      );

      if (alreadyExists) {
        return res
          .status(400)
          .json({ message: "Task for this period already exists" });
      }

      // Add new measure to the array
      existing.measures.push(newMeasureEntry);
      await existing.save();

      return res.status(200).json({
        message: "Measure added to existing assignment",
        data: existing,
      });
    }

    // If no existing assignment, create a new one
    const newAssignment = new Assignment({
      Kpi_Id,
      Kpi_Name,
      Kra_Id,
      Kra_Name,
      Goal_Id,
      Goal_Name,
      measures: [newMeasureEntry],
      assignedUser,
    });

    await newAssignment.save();
    res
      .status(201)
      .json({ message: "New assignment created", data: newAssignment });
  } catch (err) {
    console.error("Assignment creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAssignmentsByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const assignments = await Assignment.find({
      "assignedUser._id": userId,
    });

    if (!assignments.length) {
      return res
        .status(404)
        .json({ message: "No assignments found for this user." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching user assignments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
