const Recommendation = require("../models/Recommendation");

// Get recommendations for a user
exports.getUserRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findOne({ user: req.params.userId }).populate("recommendedJobs");
    if (!recommendations) return res.status(404).json({ message: "No recommendations found" });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
