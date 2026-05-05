import mongoose from "mongoose";

// Every event that affects an institution's trust score
// e.g. "data breach", "successful access", "user complaint"

const trustEventSchema = new mongoose.Schema(
  {
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "data_breach",      // -30 points
        "user_complaint",   // -10 points
        "successful_audit", // +10 points
        "compliance_pass",  // +15 points
        "manual_override",  // admin sets score directly
      ],
      required: true,
    },
    scoreDelta: { type: Number, required: true }, // how much score changed
    description: { type: String }, // optional note
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // "admin" or "system"
  },
  { timestamps: true }
);

const TrustEvent = mongoose.model("TrustEvent", trustEventSchema);
export default TrustEvent;