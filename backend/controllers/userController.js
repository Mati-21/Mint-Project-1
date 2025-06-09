import User from "../models/userModels.js";
import Sector from "../models/sectorModel.js";
import Subsector from "../models/subsectorModel.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import fs from "fs";
import path from "path";

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
      return res.status(400).json({ success: false, message: "Email already registered" });
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

    res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("[createUser] Error creating user:", error);
    res.status(500).json({ success: false, message: "Server error during user creation" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    console.log("[loginUser] Logging in with:", normalizedEmail, password);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.warn(`[loginUser] No user found for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    console.log("[loginUser] User found:", {
      email: user.email,
      storedHashedPassword: user.password,
      salt: user.salt,
    });

    const isMatch = verifyPassword(password, user.password, user.salt);
    console.log("[loginUser] Password match result:", isMatch);

    if (!isMatch) {
      console.warn(`[loginUser] Incorrect password for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

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
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};


// Get all users with populated sector/subsector names
export const getUsers = async (req, res) => {
  try {
    console.log("⏳ [getUsers] Fetching all users...");
    const users = await User.find()
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
    console.log("⏳ [getProfile] Fetching profile for user ID:", req.userId);
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("sector", "sector_name")
      .populate("subsector", "subsector_name");

    if (!user) {
      console.warn("⚠️ [getProfile] User not found:", req.userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ [getProfile] Profile found for:", user.email);
    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ [getProfile] Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
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

    console.log("✅ [getActiveUsersStats] Total:", totalUsers, "Last Month:", lastMonthCount);

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
/*
export const updateProfile = async (req, res) => {
  try {
    console.log("⏳ [updateProfile] Incoming update:", req.body);
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      console.warn("⚠️ [updateProfile] Missing required fields");
      return res.status(400).json({ success: false, message: "Missing Information" });
    }

    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    } catch (error) {
      console.warn("⚠️ [updateProfile] Invalid address JSON");
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn("⚠️ [updateProfile] User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let updatedData = { name, phone, address: parsedAddress, dob, gender };

    if (imageFile) {
      const imagePath = `/uploads/${imageFile.filename}`;
      if (user.profileImage && fs.existsSync(path.join(__dirname, "..", user.profileImage))) {
        fs.unlinkSync(path.join(__dirname, "..", user.profileImage));
      }
      updatedData.profileImage = imagePath;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    console.log("✅ [updateProfile] Profile updated for:", updatedUser.email);
    res.json({ success: true, message: "Profile updated successfully", profileImage: updatedUser.profileImage });
  } catch (error) {
    console.error("❌ [updateProfile] Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
*/
