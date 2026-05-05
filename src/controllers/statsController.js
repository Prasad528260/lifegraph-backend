import User from "../models/User.js";
import Institution from "../models/Institution.js";
import AccessLog from "../models/AccessLog.js";
import TrustEvent from "../models/TrustEvent.js";

export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalInstitutions,
      totalRequests,
      flaggedInstitutions,
      totalComplaints,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Institution.countDocuments(),
      AccessLog.countDocuments(),
      Institution.countDocuments({ flagged: true }),
      TrustEvent.countDocuments({ eventType: "user_complaint" }),
    ]);

    res.status(200).json({
      data: {
        totalUsers,
        totalInstitutions,
        totalRequests,
        flaggedInstitutions,
        totalComplaints,
      },
    });

  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};