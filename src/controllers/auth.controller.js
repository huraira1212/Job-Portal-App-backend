import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ADMIN_EMAIL } from "../config/admin.js";

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} role - User role
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ===================== REGISTER =====================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Validate request
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create new user
    const user = await User.create({ name, email, password, role });

    // ✅ Respond with user data + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Register failed" });
  }
};

// ===================== LOGIN =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate request
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });

    // ✅ Check credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 Admin email check
    if (email === ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    // ✅ Respond with user data + token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
