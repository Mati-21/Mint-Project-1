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
          .json({ message: "Measure for this period already exists" });
      }

      // Add new measure to the array
      existing.measures.push(newMeasureEntry);
      await existing.save();

      return res.status(200).json({
        message: "Measure added to existing assignment",
        data: existing,
      });
    }
    console.log("Keeeeeeeeeettttttttttttttt");

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

// export const getAssignment = async (req, res) => {
//   console.log("hello");
//   try {
//     const { id: userId } = req.params; // rename id to userId for clarity

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required." });
//     }

//     const kpiData = await MeasureAssignmentModel.find({
//       "assignedUser._id": userId,
//     });

//     if (!kpiData.length) {
//       return res
//         .status(404)
//         .json({ message: "No KPI data found for the user." });
//     }

//     res.status(200).json(kpiData);
//   } catch (error) {
//     console.error("Error fetching KPI data:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const hello = (req, res) => {
//   res.status(200).send("hello");
// };
