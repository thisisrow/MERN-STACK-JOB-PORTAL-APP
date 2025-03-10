const express = require("express");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

router.get("/:userId", recommendationController.getRecommendations); // returns job recommendations for a user
router.get('/:jobId', jobController.getUsersForJob);/ returns user recommendations for a job

module.exports = router;
