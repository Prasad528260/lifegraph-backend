import Institution from "../models/Institution.js";
import TrustEvent from "../models/TrustEvent.js";
import { getTier, eventScoreMap, clampScore } from "../utils/trustEngine.js";

// ─────────────────────────────────────────
// GET /trust/:institutionId
// get trust score + full event history
// ─────────────────────────────────────────
export const getTrust = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.institutionId);

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // get full event history for this institution
    const history = await TrustEvent.find({
      institutionId: institution._id,
    }).sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      data: {
        institution: {
          id: institution._id,
          name: institution.name,
          type: institution.type,
        },
        trustScore: institution.trustScore,
        tier: institution.tier,
        flagged: institution.flagged,
        history,
      },
    });

  } catch (error) {
    console.error("Get trust error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST /trust/event
// admin triggers a trust event
// score recalculates automatically
// ─────────────────────────────────────────
// POST /trust/event
export const addTrustEvent = async (req, res) => {
  try {
    const { institutionId, eventType, description, manualScore } = req.body;

    if (!institutionId || !eventType) {
      return res.status(400).json({
        message: "institutionId and eventType are required",
      });
    }

    const institution = await Institution.findById({_id: institutionId});
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // rest stays exactly same as before
    let scoreDelta = 0;
    let newScore = institution.trustScore;

    if (eventType === "manual_override") {
      if (manualScore === undefined || manualScore < 0 || manualScore > 100) {
        return res.status(400).json({
          message: "manualScore required (0-100) for manual_override",
        });
      }
      scoreDelta = manualScore - institution.trustScore;
      newScore = manualScore;
    } else {
      if (!eventScoreMap[eventType]) {
        return res.status(400).json({
          message: `Invalid eventType. Allowed: ${Object.keys(eventScoreMap).join(", ")}, manual_override`,
        });
      }
      scoreDelta = eventScoreMap[eventType];
      newScore = clampScore(institution.trustScore + scoreDelta);
    }

    const newTier = getTier(newScore);
    const shouldFlag = eventType === "data_breach";

    await Institution.findByIdAndUpdate({_id: institutionId}, {
      trustScore: newScore,
      tier: newTier,
      ...(shouldFlag && { flagged: true }),
    });

    const event = await TrustEvent.create({
      institutionId: institutionId,
      eventType,
      scoreDelta,
      description: description || "",
      triggeredBy: req.user._id,
    });

    res.status(201).json({
      message: "Trust event recorded",
      data: {
        event,
        updated: {
          previousScore: institution.trustScore,
          newScore,
          previousTier: institution.tier,
          newTier,
          flagged: shouldFlag,
        },
      },
    });

  } catch (error) {
    console.error("Add trust event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const fileComplaint = async (req, res) => {
  try {
    const { institutionId } = req.body;

    const institution = await Institution.findById({_id: institutionId});
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // check user actually had interaction with this institution
    const hasInteraction = await AccessLog.findOne({
      institutionId: institutionId,
      userId: req.user._id,
    });

    if (!hasInteraction) {
      return res.status(403).json({
        message: "You can only complain about institutions that accessed your data",
      });
    }

    // check if user already complained about this institution
    const alreadyComplained = await TrustEvent.findOne({
      institutionId: institutionId,
      triggeredBy: req.user._id,
      eventType: "user_complaint",
    });

    if (alreadyComplained) {
      return res.status(409).json({
        message: "You have already filed a complaint against this institution",
      });
    }

    // apply score penalty
    const scoreDelta = -10;
    const newScore = clampScore(institution.trustScore + scoreDelta);
    const newTier = getTier(newScore);

    await Institution.findByIdAndUpdate({_id: institutionId}, {
      trustScore: newScore,
      tier: newTier,
    });

    await TrustEvent.create({
      institutionId: institutionId,
      eventType: "user_complaint",
      scoreDelta,
      description: `Complaint filed by user ${req.user._id}`,
      triggeredBy: req.user._id,
    });

    res.status(200).json({
      message: "Complaint filed successfully",
      data: {
        newScore,
        newTier,
        scoreDelta,
      },
    });

  } catch (error) {
    console.error("File complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};