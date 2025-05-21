import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModels.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing information" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

   
    const user = new userModel({ username, email, password, role });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
	
  }
};



/*const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; // Get uploaded image

        if (!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Missing Information" });
        }

        let parsedAddress;
        try {
            parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let updatedData = { name, phone, address: parsedAddress, dob, gender };

        if (imageFile) {
            const imagePath = `/uploads/${imageFile.filename}`;
            
            // Remove old profile image if exists
            if (user.profileImage && fs.existsSync(path.join(__dirname, "..", user.profileImage))) {
                fs.unlinkSync(path.join(__dirname, "..", user.profileImage));
            }
            
            updatedData.profileImage = imagePath;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
        res.json({ success: true, message: "Profile updated successfully", profileImage: updatedUser.profileImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};*/

const getActiveUsersStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments({});
    const lastMonthCount = await userModel.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    });

    res.status(200).json({
      count: totalUsers,
      change: totalUsers - lastMonthCount,
      lastMonthCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export { addUser, loginUser, getProfile, getActiveUsersStats };
