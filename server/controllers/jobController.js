const Job = require("../models/Job");
const User = require("../models/User");

// Create a new job (Only Recruiters)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, experienceRequired, educationRequired, salaryRange } = req.body;
    const recruiterId = req.body.userId; // Assuming userId is sent in request body (Replace with req.user.id after adding auth middleware)

    // Validate user role
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can post jobs" });
    }

    // Create job
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      experienceRequired,
      educationRequired,
      salaryRange,
      postedBy: recruiterId, // Assign recruiter
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all jobs (with search & filter)
exports.getJobs = async (req, res) => {
  try {
    const { title, location, skills, experience, education } = req.query;
    let filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (skills) filter.requirements = { $in: skills.split(",") };
    if (experience) filter.experienceRequired = { $lte: parseInt(experience) };
    if (education) filter["educationRequired.degree"] = { $regex: education, $options: "i" };

    const jobs = await Job.find(filter).populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
