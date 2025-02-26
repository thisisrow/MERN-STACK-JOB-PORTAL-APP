const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }], 
  experienceRequired: { type: Number, default: 0 },
  educationRequired: {
    degree: String,
    field: String,
  },
  salaryRange: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
