const express = require("express");
const {
  applyForJob,
  getApplicationsForJob,
  getUserApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", applyForJob); // Apply for a job
router.get("/job/:jobId", getApplicationsForJob); // Get all applications for a job(for recrutor only)
router.get("/user/:userId", getUserApplications); // Get all applications by a user
router.put("/:applicationId/status", updateApplicationStatus); // Update application status

module.exports = router;
