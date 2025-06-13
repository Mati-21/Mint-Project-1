import generateToken from "../utils/generateToken.js";
import User from "../models/userModels.js";

import fs from "fs";
import path from "path";

import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { log } from "console";

// Create new user
export const createUser = async (req, res) => {
  try {
    let { fullName, role, email, password, sector, subsector } = req.body;
    email = email.trim().toLowerCase();

    console.log("[createUser] Incoming request body:", {
      fullName,
      role,
      email,
      sector,
      subsector,
    });
    console.log("[createUser] Raw password:", password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("[createUser] User already exists with email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const { hash, salt } = hashPassword(password);
    console.log("[createUser] Hashed password:", hash);
    console.log("[createUser] Salt:", salt);

    const newUser = new User({
      fullName,
      role,
      email,
      password: hash,
      salt,
      sector: sector || null,
      subsector: subsector || null,
    });

    await newUser.save();

    console.log("[createUser] User created successfully:", email);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("[createUser] Error creating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during user creation" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.warn(`[loginUser] No user found for email: ${normalizedEmail}`);
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = verifyPassword(password, user.password, user.salt);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        sector: user.sector,
        subsector: user.subsector,
      },
    });
  } catch (error) {
    console.error("[loginUser] Error during login:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

// Get all users with populated sector/subsector names
export const getUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const users = await User.find(userId)
      .populate("sector", "sector_name")
      .populate("subsector", "subsector_name");
    console.log(`✅ [getUsers] Fetched ${users.length} users.`);
    res.json(users);
  } catch (error) {
    console.error("❌ [getUsers] Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get profile of logged-in user by ID
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("sector", "sector_name")
      .populate("subsector", "subsector_name");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("✅ Populated user:", JSON.stringify(user, null, 2));

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

// Get statistics about active users
export const getActiveUsersStats = async (req, res) => {
  try {
    console.log("⏳ [getActiveUsersStats] Fetching user statistics...");
    const totalUsers = await User.countDocuments({});
    const lastMonthCount = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    });

    console.log(
      "✅ [getActiveUsersStats] Total:",
      totalUsers,
      "Last Month:",
      lastMonthCount
    );

    res.status(200).json({
      count: totalUsers,
      change: totalUsers - lastMonthCount,
      lastMonthCount,
    });
  } catch (error) {
    console.error("❌ [getActiveUsersStats] Server error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// Optional: Update user profile (uncomment and adjust if you want to enable)

export const updateProfile = async (req, res) => {
  try {
    // console.log("⏳ [updateProfile] Incoming update:", req.body);
    const { userId, fullName, email, sector, subsector } = req.body;
    const imageFile = req.file;

    if (!fullName || !email || !sector || !subsector) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Information" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let updatedData = {
      fullName,
      email,
      sector: user.sector,
      subsector: user.subsector,
    };
    console.log("joo", imageFile);

    if (imageFile) {
      const imagePath = `/uploads/${imageFile.filename}`;
      if (user.image && fs.existsSync(path.join("uploads", user.image))) {
        fs.unlinkSync(path.join("uploads", user.image));
      }
      updatedData.image = imagePath; // ✅ Save to correct field
    }
    console.log("final", updatedData);

    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ [updateProfile] Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
