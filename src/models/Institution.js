import mongoose from "mongoose";

// Institution = any external entity requesting access
// e.g. a bank, hospital, university

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "HDFC Bank"
    type: {
      type: String,
      enum: ["bank", "hospital", "university", "employer", "government"],
      required: true,
    },
    email: { type: String, required: true, unique: true },

    // Trust score: 0–100, calculated by TrustEngine
    trustScore: { type: Number, default: 50, min: 0, max: 100 },

    // Tier determines what domains they can access
    // Tier 1 = basic (identity only)
    // Tier 2 = standard (identity + education OR finance)
    // Tier 3 = trusted (all domains)
    tier: { type: Number, default: 1, enum: [1, 2, 3] },

    // Track if institution had any breach/violation
    flagged: { type: Boolean, default: false },
    // Institution model
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Institution = mongoose.model("Institution", institutionSchema);
export default Institution;
