import User from "../models/User.js";
import { generateToken } from "../utils/jwthelper.js";
import { validateSignup, getHashedPassword } from "../utils/validate.js";

export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateSignup({ name, email, password })) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = getHashedPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      message: "User created successfully",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Signup failed" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    return res.status(200).json({
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutController = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  });
  res.status(200).json({ message: "Logout successful" });
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // check admin secret first
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        message: "Invalid admin secret",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

   if (!validateSignup({name, email, password})) {
    return res.status(400).json({ message: "Invalid input" });
   }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = getHashedPassword(password)

    // role is hardcoded to admin here
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });
    generateToken(res, user._id);

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ message: "Admin registration failed" });
  }
};
// POST /auth/register/superadmin
export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, superAdminSecret } = req.body;

    if (!superAdminSecret || superAdminSecret !== process.env.SUPER_ADMIN_SECRET) {
      return res.status(403).json({
        message: "Invalid super admin secret",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(!validateSignup({name, email, password})) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = getHashedPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "superadmin",
    });

    generateToken(res, user._id);

    res.status(201).json({
      message: "Super admin registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Super admin register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};