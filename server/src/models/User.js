import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * UserSchema defines the structure of the User documents in MongoDB.
 * It includes fields for personal information, authentication, social connections,
 * and activity metrics. Timestamps are automatically added for createdAt and updatedAt.
 */
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    //   trim: true,
    //   index: true,
    // },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true, // Ensures no two users have the same email
    },
    password: {
      type: String,
      required: true,
      min: 5, // Minimum length for password security
    },
    refreshToken: {
      type: String,
    },
    picturePath: {
      type: String,
      default: "", // Default empty string if no profile picture is provided
    },
    friends: {
      type: Array,
      default: [], // Stores user connections/friends
    },
    viewedProfile: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Creating and exporting the User model based on UserSchema
export const User = mongoose.model("User", UserSchema);
