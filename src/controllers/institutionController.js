import Institution from "../models/Institution.js";
import User from "../models/User.js";

// ─────────────────────────────────────────
// POST /institutions/add
// only admin can create institution
// ─────────────────────────────────────────
export const addInstitution = async (req, res) => {
  try {
    const { name, type, email } = req.body;

    // basic validation
    if (!name || !type || !email) {
      return res.status(400).json({
        message: "Name, type and email are required",
      });
    }

    // check valid type
    const allowedTypes = ["bank", "hospital", "university", "employer", "government"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid type. Allowed: ${allowedTypes.join(", ")}`,
      });
    }

    // check if institution with same email exists
    const existing = await Institution.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Institution with this email already exists",
      });
    }

    // create institution — createdBy is the logged in admin
    const institution = await Institution.create({
      name,
      type,
      email,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Institution created successfully",
      data: institution,
    });

  } catch (error) {
    console.error("Add institution error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET /institutions
// any logged in user can view all institutions
// ─────────────────────────────────────────
export const getInstitutions = async (req, res) => {
  try {
    let query = {};

    // admin sees only their own institutions
    // user sees all institutions
    if (req.user.role === "admin") {
      query = { createdBy: req.user._id };
    }

    const institutions = await Institution.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: institutions.length,
      data: institutions,
    });

  } catch (error) {
    console.error("Get institutions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET /institutions/:id
// get single institution details
// ─────────────────────────────────────────
export const getInstitutionById = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // admin can only view their own institution
    if (
      req.user.role === "admin" &&
      institution.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only view your own institutions",
      });
    }

    res.status(200).json({ data: institution });

  } catch (error) {
    console.error("Get institution error:", error);
    res.status(500).json({ message: "Server error" });
  }
};