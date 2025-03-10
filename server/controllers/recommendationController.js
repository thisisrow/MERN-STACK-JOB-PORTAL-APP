const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const query = {
      $or: [
        { requirements: { $in: user.skills } }, 
        { experienceRequired: { $lte: user.experience } }, 
        { "educationRequired.degree": user.education?.degree } 
      ]
    };

    const recommendedJobs = await Job.find(query).limit(10); 

    res.status(200).json({ user: userId, recommendedJobs });

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getUsersForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Validate Job ID format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID format" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Construct query to find suitable users
    const query = {
      skills: { $in: job.requirements || [] },
      experience: { $gte: job.experienceRequired || 0 },
      ...(job.educationRequired?.degree
        ? { "education.degree": job.educationRequired.degree }
        : {}),
    };

    const suitableUsers = await User.find(query).select(
      "name email phone skills experience education"
    );

    res.status(200).json({ job: jobId, suitableUsers });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
