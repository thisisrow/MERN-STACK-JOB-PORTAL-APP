const Job = require("../models/Job");
const User = require("../models/User");

// Create a new job (Only Recruiters)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, experienceRequired, educationRequired, salaryRange } = req.body;
    const recruiterId = req.body.userId; 

    
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can post jobs" });
    }

    
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      experienceRequired,
      educationRequired,
      salaryRange,
      postedBy: recruiterId, 
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
    const { title, company, location, skills, experience, education } = req.query; 
    let filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" }; 
    if (location) filter.location = { $regex: location, $options: "i" };
    if (skills) filter.requirements = { $in: skills.split(",") };
    if (experience) filter.experienceRequired = { $lte: parseInt(experience) };
    if (education) filter["educationRequired.degree"] = { $regex: education, $options: "i" };

    const jobs = await Job.find(filter).populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
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
exports.getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.id; 
    const jobs = await Job.find({ postedBy: recruiterId });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this recruiter" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ❌ Delete a job (Only Recruiters)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.body.userId; 

    
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can delete jobs" });
    }

    
    const job = await Job.findOneAndDelete({ _id: id, postedBy: recruiterId });

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};