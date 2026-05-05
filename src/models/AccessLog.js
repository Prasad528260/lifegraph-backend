import mongoose from "mongoose";

// Every time an institution requests data, we log it
// This is your audit trail — critical for the demo

const accessLogSchema = new mongoose.Schema(
  {
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedDomains: [{ type: String }], // what they asked for
    grantedDomains: [{ type: String }],   // what they actually got
    tierAtRequest: { type: Number },  
    requestNote: { type: String, default: "" },  // "Loan application verification"
    //      // institution's tier at the time
    status: {
      type: String,
      enum: ["granted", "partial", "denied"],
      required: true,
    },
    subgraph: { type: Object, default: {} }, // the filtered graph returned
  },
  { timestamps: true }
);

const AccessLog = mongoose.model("AccessLog", accessLogSchema);
export default AccessLog;