import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    // Look for token in cookies or authorization header
    let token = req.cookies.jwt;
    
    // If no token in cookies, check authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
      console.log("Using token from Authorization header");
    }

    if (!token) {
      console.log("No authentication token found");
      return res.status(401).json({ message: "Not authorized, no token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      console.log("User not found with token payload:", decoded);
      return res.status(401).json({ message: "User not found." });
    }

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed." });
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin." });
  }
};

export { authenticate, authorizeAdmin };


