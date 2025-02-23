const Application = require("../models/Application");

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get applications for a user
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.params.userId }).populate("job");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
