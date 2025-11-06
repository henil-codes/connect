import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    // Return the user's feed (friends + own posts) instead of all posts
    const friendIds = user.friends || [];
    const feedUserIds = [...friendIds, userId];
    
    const feedPosts = await Post.find({ 
      userId: { $in: feedUserIds } 
    }).sort({ createdAt: -1 });
    
    res.status(201).json(feedPosts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's friends list
    const friendIds = user.friends || [];
    
    if (friendIds.length === 0) {
      // No friends - return empty array, frontend will show suggestion
      return res.status(200).json([]);
    }
    
    // Include user's own posts along with friends' posts
    const feedUserIds = [...friendIds, userId];
    
    // Get posts from friends and user, sorted by most recent
    const feedPosts = await Post.find({ 
      userId: { $in: feedUserIds } 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    
    console.log(`Adding comment to post ${id}:`, comment);
    
    // Use $push to add the comment to the array and return the updated document
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!updatedPost) {
      console.log(`Post with id ${id} not found`);
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(`Comment added successfully. Post now has ${updatedPost.comments.length} comments`);
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(404).json({ message: err.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Update the post description
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};