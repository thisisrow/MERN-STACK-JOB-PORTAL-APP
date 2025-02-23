const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter"], required: true },
  phone: { type: String },
  location: { type: String },
  skills: [{ type: String }],  // For job matching
  experience: { type: Number, default: 0 }, // Years of experience
  education: {
    degree: String,
    institution: String,
    yearOfCompletion: Number,
  },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
});

module.exports = mongoose.model("User", userSchema);
