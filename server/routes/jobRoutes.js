const express = require("express");
const { createJob, getJobs, getJobById , getJobsByRecruiter,deleteJob} = require("../controllers/jobController");

const router = express.Router();

router.post("/", createJob); // create a new job
router.get("/", getJobs);// get the jobs
router.get("/:id", getJobById);// get the job by id
router.get("/recruiter/:id", getJobsByRecruiter);// get the jobs by recruiter

router.delete("/recruiter/:id", deleteJob);     // delete the job by recruiter


module.exports = router;
