import AccessLog from "../models/AccessLog.js";
import Institution from "../models/Institution.js";

// ─────────────────────────────────────────
// GET /logs
// get all access logs (admin only)
// ─────────────────────────────────────────
// GET /logs — admin sees only logs for their institutions
export const getAllLogs = async (req, res) => {
  try {
    let logs;

    if (req.user.role === "superadmin") {
      // superadmin sees everything
      logs = await AccessLog.find()
        .populate("institutionId", "name type trustScore tier")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } else {
      // admin sees only their institution logs
      const adminInstitutions = await Institution.find({
        createdBy: req.user._id,
      }).select("_id");

      const institutionIds = adminInstitutions.map((inst) => inst._id);

      logs = await AccessLog.find({
        institutionId: { $in: institutionIds },
      })
        .populate("institutionId", "name type trustScore tier")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error("Get all logs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /logs/institution/:institutionId
export const getInstitutionLogs = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.institutionId);

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // admin can only see logs for their own institutions
    if (institution.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only view logs for your own institutions",
      });
    }

    const logs = await AccessLog.find({
      institutionId: req.params.institutionId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error("Get institution logs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET /logs/user/:userId
// get all access logs for a specific user
// user can only see their own logs
// admin can see anyone's logs
// ─────────────────────────────────────────
export const getUserLogs = async (req, res) => {
  try {
    const requestedUserId = req.user._id;

    // superadmin can see anyone
    // admin can see anyone
    // user can only see their own
    if (
      req.user.role !== "superadmin" &&
      req.user.role !== "admin" &&
      req.user._id.toString() !== requestedUserId.toString()
    ) {
      return res.status(403).json({
        message: "You can only view your own access logs",
      });
    }

    const logs = await AccessLog.find({ userId: requestedUserId })
      .populate("institutionId", "name type trustScore tier flagged")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error("Get user logs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET /logs/institution/:institutionId
// get all access logs for a specific institution
// admin only
