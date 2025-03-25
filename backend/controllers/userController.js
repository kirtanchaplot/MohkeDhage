import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Check if either email or mobile is provided
  if (!username || (!email && !mobile) || !password) {
    return res.status(400).json({ message: "Please provide your name, password, and either email or mobile number." });
  }

  // Validate password - alphanumeric with at least 7 characters
  if (password.length < 7) {
    return res.status(400).json({ message: "Password must be at least 7 characters long" });
  }
  
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ message: "Password must contain both letters and numbers" });
  }

  // Validate mobile number if provided
  if (mobile && !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
  }

  // Check if user exists with either email or mobile
  let userExists = null;
  if (email) {
    userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });
  }
  
  if (mobile) {
    userExists = await User.findOne({ mobile });
    if (userExists) return res.status(400).json({ message: "Mobile number already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ 
    username, 
    email, 
    mobile,
    password: hashedPassword 
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      mobile: newUser.mobile,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // Get login identifier (email or mobile) and password
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password) {
    return res.status(400).json({ message: "Please provide your email/mobile and password" });
  }

  // Check if the identifier is an email or mobile number
  const isEmail = emailOrMobile.includes('@');
  
  // Find user by either email or mobile
  let existingUser;
  if (isEmail) {
    existingUser = await User.findOne({ email: emailOrMobile });
  } else {
    // Assume it's a mobile number if it's not an email
    existingUser = await User.findOne({ mobile: emailOrMobile });
  }

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      // Create token and set cookie
      const token = createToken(res, existingUser._id);

      // Log for debugging
      console.log('Login successful:', {
        userId: existingUser._id,
        identifier: isEmail ? 'email' : 'mobile'
      });

      // Send response with user info and token
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        mobile: existingUser.mobile,
        isAdmin: existingUser.isAdmin,
        token: token
      });
      return;
    }
  }

  res.status(401).json({ message: "Invalid credentials" });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    
    // Handle email update
    if (req.body.email !== undefined) {
      // Check if another user already has this email
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already registered to another account" });
        }
      }
      user.email = req.body.email;
    }
    
    // Handle mobile update
    if (req.body.mobile !== undefined) {
      // Check if valid mobile and if another user already has this mobile
      if (req.body.mobile) {
        if (!/^\d{10}$/.test(req.body.mobile)) {
          return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }
        
        if (req.body.mobile !== user.mobile) {
          const mobileExists = await User.findOne({ mobile: req.body.mobile });
          if (mobileExists) {
            return res.status(400).json({ message: "Mobile number already registered to another account" });
          }
        }
      }
      user.mobile = req.body.mobile;
    }

    // Ensure at least one contact method exists
    if (!user.email && !user.mobile) {
      return res.status(400).json({ message: "At least one contact method (email or mobile) is required" });
    }

    if (req.body.password) {
      // Validate password
      if (req.body.password.length < 7) {
        return res.status(400).json({ message: "Password must be at least 7 characters long" });
      }
      
      if (!/[A-Za-z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)) {
        return res.status(400).json({ message: "Password must contain both letters and numbers" });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};