const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, userId, coverLetter } = req.body;

    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    
    const user = await User.findById(userId);
    if (!user || user.role !== "student") {
      return res.status(403).json({ error: "Only students can apply for jobs" });
    }

    
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }

    
    const application = new Application({
      job: jobId,
      applicant: userId,
      coverLetter,
    });

    await application.save();
       
       await User.findByIdAndUpdate(userId, { 
        $push: { appliedJobs: jobId } 
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all applications for a job (Recruiter Only)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applications = await Application.find({ job: jobId }).populate("applicant", "name email");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all applications by a user
exports.getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const applications = await Application.find({ applicant: userId }).populate("job", "title company location");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update application status (Recruiter Only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log(`Updating application ${applicationId} to status: ${status}`);

   
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true } 
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    console.log("Updated Application:", application);
    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

