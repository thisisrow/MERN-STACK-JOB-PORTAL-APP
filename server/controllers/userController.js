const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Get all users (for testing)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile (Only for allowed fields)
exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
  
      const allowedFields = ["name", "phone", "location", "skills", "experience", "education", "savedJobs"];
      
      const filteredUpdates = {};
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });
  
      const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
