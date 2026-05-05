import Graph from "../models/Graph.js";

// GET /graph
export const getGraph = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const graph = await Graph.findOne({ userId });

    if (!graph) {
      return res.status(404).json({
        message: "No graph found. Please update your capsule first.",
      });
    }

    res.status(200).json({ data: graph });

  } catch (error) {
    console.error("Get graph error:", error);
    res.status(500).json({ message: "Server error" });
  }
};