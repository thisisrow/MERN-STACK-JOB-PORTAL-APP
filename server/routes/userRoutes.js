const express = require("express");
const { getAllUsers, getUserById, updateUser, uploadResume } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);// get all users
router.get("/:id", getUserById);// get user by id
router.put("/:id", updateUser);// update user by id
router.post("/:userId/resume", uploadResume);

module.exports = router;
