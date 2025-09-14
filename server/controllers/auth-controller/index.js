const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("Registration request received:", req.body);

  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    console.log("Missing required fields");
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, password, role) are required."
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { name }],
  });

  console.log("Existing user check result:", existingUser ? "User exists" : "User doesn't exist");

  if (existingUser) {
    console.log("User already exists:", existingUser.email);
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  console.log("Creating new user...");
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    role,
    password: hashPassword,
  });

  try {
    await newUser.save();
    console.log("User saved successfully:", newUser.email);
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (saveError) {
    console.error("Error saving user:", saveError);
    return res.status(500).json({
      success: false,
      message: "Failed to save user",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email, password: "***" });

  const checkUser = await User.findOne({ email });
  console.log("User found in database:", checkUser ? "Yes" : "No");

  if (!checkUser) {
    console.log("User not found");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, checkUser.password);
  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("Invalid password");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        name: checkUser.name,
        email: checkUser.email,
        phone: checkUser.phone,
        role: checkUser.role,
      },
    },
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile };
