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
    picturePath: {
      type: String,
      default: "", // Default empty string if no profile picture is provided
    },
    friends: {
      type: Array,
      default: [], // Stores user connections/friends
    },
    location: String, // Optional field for user's location
    occupation: String, // Optional field for user's occupation
    viewedProfile: Number, // Tracks the number of times profile was viewed
    impressions: Number, // Tracks the total number of post impressions
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Creating and exporting the User model based on UserSchema
const User = mongoose.model("User", UserSchema);
export default User;
