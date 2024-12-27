// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Set token expiry time
};

// Register new user (commuter, bus operator, or admin)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create and save new user
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate a token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login user (commuter, bus operator, or admin)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email (trim the email to avoid extra spaces)
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check if the password matches the stored hash using the matchPassword method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a token if authentication is successful
    const token = generateToken(user._id);

    // Send response with the token and user details
    res.json({ token, user });
  } catch (err) {
    console.error("Error during login:", err); // Log any errors
    res.status(400).json({ error: err.message });
  }
};
// Middleware to authenticate a user using the token
export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Store user ID in request object
    next(); // Call the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get current user's profile (protected route)
export const getProfile = async (req, res) => {
  try {
    // Find user by the ID from the token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
