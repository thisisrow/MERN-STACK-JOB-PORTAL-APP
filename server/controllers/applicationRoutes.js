const express = require("express");
const { applyForJob, getUserApplications } = require("../controllers/applicationController");

const router = express.Router();

router.post("/", applyForJob);
router.get("/user/:userId", getUserApplications);

module.exports = router;
