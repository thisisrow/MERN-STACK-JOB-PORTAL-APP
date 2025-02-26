const express = require("express");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

router.get("/:userId", recommendationController.getRecommendations); // returns job recommendations for a user

module.exports = router;
