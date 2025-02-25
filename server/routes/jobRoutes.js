const express = require("express");
const { createJob, getJobs, getJobById , getJobsByRecruiter,deleteJob} = require("../controllers/jobController");

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.get("/recruiter/:id", getJobsByRecruiter);

router.delete("/recruiter/:id", deleteJob);


module.exports = router;
