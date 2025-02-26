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
