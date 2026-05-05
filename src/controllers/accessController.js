import Institution from "../models/Institution.js";
import Graph from "../models/Graph.js";
import AccessLog from "../models/AccessLog.js";
import { getTier, tierPermissions } from "../utils/trustEngine.js";
import { filterSubgraph } from "../utils/subgraphFilter.js";
import User from "../models/User.js";

// ─────────────────────────────────────────
// POST /access/request
// institution requests access to user data
// ─────────────────────────────────────────
export const requestAccess = async (req, res) => {
  try {
    // console.log("Request body:", req.body); // add this
    const { institutionId, userEmail, requestedDomains, requestNote } =
      req.body;
    // console.log("requestedDomains:", requestedDomains);

    if (!institutionId || !userEmail) {
      return res.status(400).json({
        message: "institutionId and userEmail are required",
      });
    }

    // find user by email instead of ID
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        message: "No user found with this email",
      });
    }

    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // flagged check
    if (institution.flagged) {
      await AccessLog.create({
        institutionId: institutionId,
        userId: user._id,
        requestedDomains: requestedDomains || [],
        grantedDomains: [],
        tierAtRequest: institution.tier,
        status: "denied",
        requestNote: requestNote || "",
        subgraph: { nodes: [], edges: [] },
      });

      return res.status(403).json({
        message: "Access denied — institution is flagged due to data breach",
        trustScore: institution.trustScore,
        tier: institution.tier,
      });
    }

    // accessController.js — fix this section

    const tier = getTier(institution.trustScore);
    const allowedDomains = tierPermissions[tier];

    // what institution actually gets = intersection of what they requested + what tier allows
    const effectiveDomains =
      requestedDomains && requestedDomains.length > 0
        ? requestedDomains.filter((d) => allowedDomains.includes(d))
        : allowedDomains; // if nothing requested, give everything tier allows

    const graph = await Graph.findOne({ userId: user._id });
    if (!graph) {
      return res.status(404).json({
        message: "User has no graph data yet",
      });
    }

    // pass effectiveDomains not tier
    const subgraph = filterSubgraph(graph, effectiveDomains);

    // status logic
    let status = "granted";
    if (requestedDomains && requestedDomains.length > 0) {
      const deniedDomains = requestedDomains.filter(
        (d) => !allowedDomains.includes(d),
      );
      if (deniedDomains.length === requestedDomains.length) {
        status = "denied";
      } else if (deniedDomains.length > 0) {
        status = "partial";
      } else {
        status = "granted";
      }
    }

    await AccessLog.create({
      institutionId: institutionId,
      userId: user._id,
      requestedDomains: requestedDomains || [],
      grantedDomains: effectiveDomains, // ← use effectiveDomains
      tierAtRequest: tier,
      status,
      requestNote: requestNote || "",
      subgraph: {
        nodes: subgraph.nodes,
        edges: subgraph.edges,
      },
    });

    res.status(200).json({
      message: "Access processed",
      institution: {
        name: institution.name,
        trustScore: institution.trustScore,
        tier,
        flagged: institution.flagged,
      },
      access: {
        status,
        requestedDomains: requestedDomains || [],
        grantedDomains: effectiveDomains, // ← use effectiveDomains
      },
      subgraph: {
        nodes: subgraph.nodes,
        edges: subgraph.edges,
      },
    });
  } catch (error) {
    console.error("Access request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
