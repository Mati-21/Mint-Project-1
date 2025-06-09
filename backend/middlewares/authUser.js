import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach user info to the request
    next();
  } catch (error) {
    console.error("authUser error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
