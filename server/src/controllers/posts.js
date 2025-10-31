import { Post } from "../models/Post.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Create a new post
const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const picturePath = req.file?.path;
    console.log(picturePath);

    if (!picturePath) {
      throw new ApiError(400, "Picture path is required");
    }

    const uploadedPost = await uploadToCloudinary(picturePath);
    console.log(uploadedPost);

    const newPost = new Post({
      userId: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      description,
      avatar: req.user.avatar,
      picturePath: uploadedPost,
      likes: {},
      comments: [],
    });

    const savedPost = await newPost.save();

    return res
      .status(201)
      .json({ post: savedPost, msg: "Post created successfully" });
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
};

// Get posts for a specific user with pagination
const getUserPosts = async (req, res) => {
  try {
    console.log({
      user: req.user,
      body: req.body,
      query: req.query,
      params: req.params,
    });
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({ posts });
  } catch (err) {
    throw new ApiError(500, "Internal server error");
  }
};

// Get feed posts with pagination
const getFeedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({ posts });
  } catch (err) {
    throw new ApiError(500, "Internal server error");
  }
};

const likePost = async (req, res) => {
  try {
    const { _id, userId } = req.body;
    const post = await Post.findById(_id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatePost = await Post.findByIdAndUpdate(
      _id,
      { likes: post.likes },
      { new: true }
    );
  } catch (err) {
    throw new ApiError(500, err.message);
  }
};

export { createPost, getUserPosts, getFeedPosts };
