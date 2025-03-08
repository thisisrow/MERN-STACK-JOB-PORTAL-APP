const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'applicant',
        select: 'name email phone location skills experience education description resume'
      });
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

// Helper function for fallback ranking
const calculateMatchScore = (job, applicant) => {
  let score = 0;
  let reasons = [];

  // Match skills (30 points)
  const matchedSkills = job.requirements.filter(req => 
    applicant.skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
  );
  const skillScore = Math.min(30, (matchedSkills.length / job.requirements.length) * 30);
  score += skillScore;
  reasons.push(`Matched ${matchedSkills.length} out of ${job.requirements.length} required skills`);

  // Experience match (25 points)
  const expScore = applicant.experience >= job.experienceRequired ? 25 : 
    (applicant.experience / job.experienceRequired) * 25;
  score += expScore;
  reasons.push(`Has ${applicant.experience} years of experience (${job.experienceRequired} required)`);

  // Education match (25 points)
  if (applicant.education?.degree && job.educationRequired?.degree) {
    const degreeMatch = applicant.education.degree.toLowerCase().includes(job.educationRequired.degree.toLowerCase());
    if (degreeMatch) {
      score += 25;
      reasons.push("Education requirements match");
    }
  }

  // Location match (10 points)
  if (applicant.location && job.location) {
    const locationMatch = applicant.location.toLowerCase().includes(job.location.toLowerCase());
    if (locationMatch) {
      score += 10;
      reasons.push("Location matches job requirement");
    }
  }

  // Resume text analysis (10 points)
  if (applicant.description) {
    const keywordMatches = job.requirements.filter(req =>
      applicant.description.toLowerCase().includes(req.toLowerCase())
    );
    const resumeScore = Math.min(10, (keywordMatches.length / job.requirements.length) * 10);
    score += resumeScore;
    reasons.push(`Found ${keywordMatches.length} keyword matches in resume`);
  }

  return {
    score: Math.round(score),
    explanation: reasons.join(". ")
  };
};

// Rank applications for a job using AI with fallback
exports.rankApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get all applications for this job with applicant details
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'applicant',
        select: 'name email phone location skills experience education description'
      });

    if (!applications.length) {
      return res.status(404).json({ error: "No applications found for this job" });
    }

    // Process each application
    const rankedApplications = await Promise.all(applications.map(async (application) => {
      const applicant = application.applicant;
      let aiResponse;

      try {
        // Prepare structured data for AI analysis
        const jobContext = {
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements,
          experienceRequired: job.experienceRequired,
          education: job.educationRequired
        };

        const candidateContext = {
          skills: applicant.skills,
          experience: applicant.experience,
          education: applicant.education,
          resumeText: applicant.description
        };

        // Get AI analysis
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert HR AI assistant that evaluates job applications. Provide scores and explanations based on matching candidate qualifications with job requirements."
            },
            {
              role: "user",
              content: JSON.stringify({
                task: "Evaluate candidate fit for job position",
                jobDetails: jobContext,
                candidateDetails: candidateContext,
                outputFormat: {
                  score: "number 0-100",
                  explanation: "brief evaluation highlighting strengths and gaps"
                }
              })
            }
          ],
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
          temperature: 0.3
        });

        aiResponse = JSON.parse(completion.choices[0].message.content);
      } catch (error) {
        console.log("AI ranking failed, using fallback scoring system");
        // Use fallback ranking system
        aiResponse = calculateMatchScore(job, applicant);
      }

      return {
        applicationId: application._id,
        applicant: {
          id: applicant._id,
          name: applicant.name,
          email: applicant.email,
          phone: applicant.phone,
          location: applicant.location,
          skills: applicant.skills,
          experience: applicant.experience,
          education: applicant.education
        },
        status: application.status,
        appliedAt: application.appliedAt,
        score: aiResponse.score,
        analysis: aiResponse.explanation
      };
    }));

    // Sort by score in descending order
    rankedApplications.sort((a, b) => b.score - a.score);

    res.status(200).json(rankedApplications);
  } catch (error) {
    console.error("Error ranking applications:", error);
    res.status(500).json({ error: "Server error while ranking applications" });
  }
};

