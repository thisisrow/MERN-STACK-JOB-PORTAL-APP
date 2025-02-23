const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { 
      type: String, 
      enum: ["pending", "reviewed", "interview", "rejected", "hired"], 
      default: "pending" 
    },
    appliedAt: { type: Date, default: Date.now },
    coverLetter: { type: String },
  });
  
  module.exports = mongoose.model("Application", applicationSchema);
  