import mongoose from "mongoose";

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
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
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
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Creating and exporting the User model based on UserSchema
const User = mongoose.model("User", UserSchema);
export default User;
