const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter"], required: true },
  phone: { type: String },
  location: { type: String },
  skills: [{ type: String }], 
  experience: { type: Number, default: 0 }, 
  education: {
    degree: String,
    institution: String,
    yearOfCompletion: Number,
  },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
}, { timestamps: true }); 

module.exports = mongoose.model("User", userSchema);
