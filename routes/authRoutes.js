import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  authenticate,
  getProfile,
} from "../controllers/authController.js";

// Register new user (commuter, bus operator, or admin)
router.post("/register", registerUser);

// Login user (commuter, bus operator, or admin)
router.post("/login", loginUser);

// Protected route to get current user's profile
router.get("/profile", authenticate, getProfile);

export default router;
