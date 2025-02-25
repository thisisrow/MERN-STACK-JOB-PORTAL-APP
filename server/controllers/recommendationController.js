const Job = require("../models/Job");
const User = require("../models/User");

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct query dynamically to match skills, experience, and education
    const query = {
      $or: [
        { requirements: { $in: user.skills } }, // Matches at least one skill
        { experienceRequired: { $lte: user.experience } }, // Experience should be less than or equal
        { "educationRequired.degree": user.education?.degree } // Degree should match
      ]
    };

    const recommendedJobs = await Job.find(query).limit(10); // Limit results for performance

    res.status(200).json({ user: userId, recommendedJobs });

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Server error" });
  }
};
