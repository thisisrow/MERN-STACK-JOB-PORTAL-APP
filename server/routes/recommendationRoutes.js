const express = require("express");
const { getUserRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.get("/:userId", getUserRecommendations);

module.exports = router;
