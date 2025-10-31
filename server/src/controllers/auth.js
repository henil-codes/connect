import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { CourierClient } from "@trycourier/courier";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
};

// User registration controller
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, friends } = req.body;

    // Generate a random salt and hash the password for security
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const picturePathLocal = req.file?.path;

    if (!picturePathLocal) {
      throw new ApiError(400, "Local avatar path is required");
    }

    const picturePath = await uploadToCloudinary(picturePathLocal);

    if (!picturePath) {
      throw new ApiError(400, "Picture path is required");
    }

    // Create a new user instance with hashed password and random activity metrics
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: picturePath,
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

// User login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "The user doesn't exist." });

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) throw new ApiError(400, "The credentials are invalid!");

    // Generate JWT token using the user's ID
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const token = accessToken;

    // Remove password before sending the user object to the client
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Respond with the token and user information
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({ token, loggedInUser, msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({ msg: "Logout successful" });
  } catch (err) {
    res.status(500).json({ logoutError: err.message });
  }
};

// Forgot password controller
const forgotPassword = async (req, res) => {
  // Implementation for forgot password functionality

  try {
    const authToken = process.env.COURIER_API_KEY;
    const courier = CourierClient({ authorizationToken: authToken });

    // Find the user by email
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ msg: "The user doesn't exist." });

    const { requestId } = await courier.send({
      message: {
        to: {
          email: "code80147@gmail.com",
        },
        template: process.env.COURIER_TEMPLATE_ID,
        data: {},
      },
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
  }
};

export { register, login, logout, forgotPassword };
