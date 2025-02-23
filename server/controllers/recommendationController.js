const Job = require("../models/Job");
const User = require("../models/User");

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find jobs matching user's skills, experience, and education
    const recommendedJobs = await Job.find({
      requirements: { $in: user.skills },  // At least one skill should match
      experienceRequired: { $lte: user.experience },  // Experience should match or be less
      "educationRequired.degree": user.education.degree  // Degree should match
    });

    if (recommendedJobs.length === 0) {
      return res.status(200).json({ message: "No recommendations found" });
    }

    res.status(200).json({ user: userId, recommendedJobs });

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Server error" });
  }
};
