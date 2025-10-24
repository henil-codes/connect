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
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends } =
      req.body;

    // Generate a random salt and hash the password for security
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user instance with hashed password and random activity metrics
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
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
 * Handles user login by validating credentials, generating a JWT token,
 * and returning the token along with user data (excluding password).
 *
 * @param {Object} req - Express request object, expects email & password in req.body
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "The user doesn't exist." });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "The credentials are invalid!" });

    // Generate JWT token using the user's ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove password before sending the user object to the client
    delete user.password;

    // Respond with the token and user information
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import { CourierClient } from "@trycourier/courier";

const forgotPassword = async (req, res) => {
  // Implementation for forgot password functionality

  try {
    const authToken = process.env.COURIER_API_KEY;
    const courier = CourierClient({ authorizationToken: authToken });

    const { requestId } = await courier.send({
      message: {
        to: {
          email: "code80147@gmail.com",
        },
        template: "GCQ5HSY8KRM46SHQACVA56ZQSGDY",
        data: {},
      },
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
  }
};

export { register, login, forgotPassword };
