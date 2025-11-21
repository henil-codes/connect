import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * REGISTER USER
 * Handles user registration by hashing the password, creating a new user,
 * and saving it to the database. Returns the saved user as JSON.
 * 
 * @param {Object} req - Express request object, expects user data in req.body
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[@$!%*?&#]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one special character" });
    }

    // Get Cloudinary URL from uploaded file
    const picturePath = req.file ? req.file.path : "";

    // Generate a random salt and hash the password for security
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user instance with hashed password and random activity metrics
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save the user in the database and respond with the saved user
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * LOGIN USER
 * Handles user login by validating credentials and returning a JWT token
 * 
 * @param {Object} req - Express request object, expects email and password in req.body
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    // Find user by email (case-insensitive)
    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "User does not exist." });
    }

    console.log("User found:", user.firstName, user.lastName);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    console.log("Password matches, generating token");

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Remove password from response
    
    console.log("Login successful for:", user.firstName, user.lastName);
    res.status(200).json({ token, user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


