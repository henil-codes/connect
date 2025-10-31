import { Post } from "../models/Post.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const picturePath = req.file?.path;
    console.log(picturePath)

    if (!picturePath) {
      throw new ApiError(400, "Picture path is required");
    }

    const uploadedPost = await uploadToCloudinary(picturePath);
    console.log(uploadedPost)

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

const getUserPosts = async (req, res) => {
  try {
    console.log({user: req.user, body: req.body, query: req.query, params: req.params});
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

export { createPost, getUserPosts, getFeedPosts };
