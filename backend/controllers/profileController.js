import User from "../models/userModels.js";
import fs from "fs";
import path from "path";

// Get user profile by userId from auth middleware (req.userId)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password") // exclude password
      .populate("sector", "sector_name")
      .populate("subsector", "subsector_name");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { fullName, phone, address, dob, gender } = req.body;
    const imageFile = req.file; // if using multer for file upload

    if (!fullName || !phone || !address || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Parse address if sent as JSON string
    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let updatedData = {
      fullName,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    if (imageFile) {
      const imagePath = `/uploads/${imageFile.filename}`;

      // Delete old profile image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(process.cwd(), "uploads", path.basename(user.profileImage));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedData.profileImage = imagePath;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true })
      .select("-password")
      .populate("sector", "sector_name")
      .populate("subsector", "subsector_name");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

