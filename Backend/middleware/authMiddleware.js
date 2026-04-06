import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ ADD THIS

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from DB
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 4. Check if blocked
      if (user.isBlocked) {
        return res.status(403).json({
          message: "Your account has been blocked. Contact admin.",
        });
      }

      // 5. Attach FULL user (better than decoded)
      req.user = user;

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};