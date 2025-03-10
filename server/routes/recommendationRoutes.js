const express = require("express");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

router.get("/user/:userId", recommendationController.getRecommendations); // returns job recommendations for a user
router.get("/recruiter/:jobId", recommendationController.getUsersForJob);// returns user recommendations for a job

module.exports = router;
