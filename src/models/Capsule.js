import mongoose from "mongoose";

// Capsule = a user's real-world data, split by domain
// Think of it as the "raw data vault" that feeds the graph

const capsuleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one capsule per user
    },

    identity: {
      name: { type: String },
      dob: { type: Date }, // calculate age on frontend when needed
      pan: { type: String }, // masked when shared
      nationality: { type: String },
    },

    education: {
      ssc: {
        school: String,
        percentage: Number,
        year: Number,
      },
      hsc: {
        school: String,
        percentage: Number,
        stream: String,
        year: Number,
      },
      graduation: {
        degree: String,
        college: String,
        gpa: Number,
        year_of_passing: Number,
      },
      postGraduation: {
        degree: String,
        college: String,
        gpa: Number,
        year_of_passing: Number,
      },
    },

    finance: {
      income: { type: Number },
      credit_score: { type: Number },
      loans: [{ type: String }],
      bank: { type: String },
      assets: [{ type: String }],
    },

    health: {
      blood_group: { type: String },
      conditions: [{ type: String }],
      insurance: { type: String },
    },
  },
  { timestamps: true },
);

const Capsule = mongoose.model("Capsule", capsuleSchema);
export default Capsule;
