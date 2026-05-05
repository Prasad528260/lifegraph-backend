// score boundaries for each tier
// this is the core mapping — everything else uses this
export const getTier = (score) => {
  if (score <= 40) return 1;
  if (score <= 70) return 2;
  return 3;
};

// what domains each tier can access
// this is used by access controller to filter graph
export const tierPermissions = {
  1: ["identity"],
  2: ["identity", "education", "finance"],
  3: ["identity", "education", "finance", "health"],
};

// score delta for each event type
export const eventScoreMap = {
  data_breach: -30,
  user_complaint: -10,
  successful_audit: +10,
  compliance_pass: +15,
};

// clamps score between 0 and 100
export const clampScore = (score) => {
  return Math.min(100, Math.max(0, score));
};