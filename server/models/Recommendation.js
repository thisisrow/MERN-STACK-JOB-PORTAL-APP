const mongoose = require("mongoose");
const recommendationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recommendedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    generatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Recommendation", recommendationSchema);
  