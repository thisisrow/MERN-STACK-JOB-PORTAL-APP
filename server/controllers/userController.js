const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./temp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }
    const fileName = `${req.params.userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("resume");

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

// Upload resume
exports.uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resumePath = path.join(__dirname, "..", "temp", req.file.filename);

      // Upload to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(resumePath, {
        folder: 'resumes',
        resource_type: 'auto',
        public_id: `resume_${req.params.userId}_${Date.now()}`,
        format: 'pdf'
      });

      // Extract text from PDF
      const dataBuffer = fs.readFileSync(resumePath);
      const pdfData = await pdfParse(dataBuffer);

      // Update user document with new data
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            resume: cloudinaryResponse.secure_url,
            description: pdfData.text
          }
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Failed to update user document');
      }

      // Delete temporary file
      fs.unlinkSync(resumePath);

      res.status(200).json({
        message: "Resume uploaded successfully",
        resumeUrl: updatedUser.resume,
        description: updatedUser.description,
        cloudinaryDetails: {
          publicId: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
          format: cloudinaryResponse.format,
          size: cloudinaryResponse.bytes
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: "Server error while uploading resume",
        details: error.message 
      });
    }
  });
};
