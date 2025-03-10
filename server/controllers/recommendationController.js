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
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Construct the query to find users that match the job requirements
    const query = {
      $and: [
        { skills: { $in: job.requirements } }, // Check if user's skills match job requirements
        { experience: { $gte: job.experienceRequired } }, // Check if user's experience is >= job's experience requirement
        job.educationRequired?.degree
          ? { "education.degree": job.educationRequired.degree } // Match degree if required
          : {},
      ],
    };

    // Find users who match the job's requirements
    const suitableUsers = await User.find(query).select("name email skills experience education"); // Limit fields for performance

    res.status(200).json({ job: jobId, suitableUsers });
  } catch (error) {
    console.error("Error fetching users for the job:", error);
    res.status(500).json({ error: "Server error" });
  }
};
