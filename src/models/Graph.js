import mongoose from "mongoose";

// Graph = visual/structural representation of the user's life
// Nodes are data points, edges are relationships between them

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },   // e.g. "edu_1", "fin_1"
    label: { type: String, required: true }, // e.g. "B.Tech - IIT Bombay"
    domain: {
      type: String,
      enum: ["identity", "education", "finance", "health"],
      required: true,
    },
    // inside nodeSchema
    visible: { type: Boolean, default: true },
    data: { type: Object, default: {} }, // actual values from capsule
  },
  { _id: false } // no separate _id for subdocs
);

const edgeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // node id
    to: { type: String, required: true },   // node id
    relation: { type: String, required: true }, // e.g. "studied_at", "has_loan"
  },
  { _id: false }
);

const graphSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one graph per user
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
  },
  { timestamps: true }
);

const Graph = mongoose.model("Graph", graphSchema);
export default Graph;