import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a given user ID.
 * @param {string} userId - The user ID to encode in the token.
 * @returns {string} - Signed JWT token.
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" } // token expiry time (adjust as needed)
  );
};

export default generateToken;
