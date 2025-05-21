import Report from "../models/reportModels.js";
import User from "../models/userModels.js"; 

export const createReport = async (req, res) => {
  try {
    const { email, title, content, narration, performance } = req.body; 

    if (!email || !title || !content || !narration || !performance) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate the current quarter and year
    const currentDate = new Date();
    const quarter = Math.ceil((currentDate.getMonth() + 1) / 3); // Divide month by 3 to get the quarter
    const year = currentDate.getFullYear();

    // Calculate percentage based on performance
    let percentage;
    switch (performance.toLowerCase()) {
      case "excellent":
        percentage = 90;
        break;
      case "good":
        percentage = 75;
        break;
      case "average":
        percentage = 50;
        break;
      case "poor":
        percentage = 25;
        break;
      default:
        return res.status(400).json({ error: "Invalid performance value." });
    }

    // Create a new report with calculated percentage
    const newReport = new Report({ 
      userId: user._id, 
      title, 
      content, 
      narration, 
      performance, 
      percentage, 
      quarter, 
      year 
    });
    await newReport.save();

    res.status(201).json({ message: "Report created", data: newReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};