import Capsule from "../models/Capsule.js";
import {generateGraph} from "../utils/graphGenerator.js"

// allowed fields per domain
// if someone sends { "hacker": "data" } it gets stripped out
const allowedFields = {
  identity: ["name", "dob", "pan", "nationality"],
  education: ["ssc", "hsc", "graduation", "postGraduation"],
  finance: ["income", "credit_score", "loans", "bank", "assets"],
  health: ["blood_group", "conditions", "insurance"],
};

// strips out any fields not in allowedFields
const sanitizeCapsule = (body) => {
  const sanitized = {};

  for (const domain in allowedFields) {
    // if user sent this domain
    if (body[domain]) {
      // check it's an object not array/string etc
      if (typeof body[domain] !== "object" || Array.isArray(body[domain])) {
        continue; // skip invalid domain data
      }

      sanitized[domain] = {};

      for (const field of allowedFields[domain]) {
        // only pick allowed fields
        if (body[domain][field] !== undefined) {
          sanitized[domain][field] = body[domain][field];
        }
      }

      // if domain was sent but had no valid fields, remove it
      if (Object.keys(sanitized[domain]).length === 0) {
        delete sanitized[domain];
      }
    }
  }

  return sanitized;
};
export const getCapsule = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const capsule = await Capsule.findOne({ userId: userId });

    if (!capsule) {
      return res.status(404).json({
        message: "No capsule found. Please update your capsule first.",
      });
    }

    res.status(200).json({ data: capsule });

  } catch (error) {
    console.error("Get capsule error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCapsule = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log("updateCapsule called with userId:", userId);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    // sanitize — strip unknown fields
    const sanitizedData = sanitizeCapsule(req.body);

    // if nothing valid was sent
    if (Object.keys(sanitizedData).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided",
        allowedDomains: Object.keys(allowedFields),
      });
    }

    // build $set object with dot notation so we don't overwrite other domains
    // e.g. { "finance.income": 120000 } not { finance: { income: 120000 } }
    const setObject = {};
    for (const domain in sanitizedData) {
      for (const field in sanitizedData[domain]) {
        setObject[`${domain}.${field}`] = sanitizedData[domain][field];
      }
    }
    // upsert — create if doesn't exist, update if it does
    const capsule = await Capsule.findOneAndUpdate(
      { userId: userId },
      { $set: setObject },
      { new: true, upsert: true, runValidators: true }
    );
    if (!capsule) {
      return res.status(500).json({ message: "Failed to update capsule" });
    }
    await generateGraph(userId, capsule);
    res.status(200).json({
      message: "Capsule updated successfully",
      data: capsule,
    });
  } catch (error) {
    console.error("Error updating capsule:", error);
    res.status(500).json({ message: error.message });
  }
};


