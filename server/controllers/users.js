import User from "../models/User.js";
import bcrypt from "bcrypt";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, {
      password: 0, // Exclude password field
      resetPasswordToken: 0,
      resetPasswordExpires: 0
    }).sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET USER FRIENDS */
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, location, occupation, bio } = req.body;
    
    // Validate input
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    if (firstName.length < 2 || firstName.length > 50) {
      return res.status(400).json({ message: "First name must be between 2 and 50 characters" });
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return res.status(400).json({ message: "Last name must be between 2 and 50 characters" });
    }

    if (bio && bio.length > 160) {
      return res.status(400).json({ message: "Bio must be 160 characters or less" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        location: location?.trim() || "", 
        occupation: occupation?.trim() || "", 
        bio: bio?.trim() || "" 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find user and include password for verification
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(id, { password: passwordHash });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* FRIEND REQUEST SYSTEM */
export const sendFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    
    if (id === friendId) {
      return res.status(400).json({ message: "Cannot send friend request to yourself" });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Check if request already sent
    if (user.friendRequestsSent.includes(friendId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Check if there's a pending request from the other user
    if (user.friendRequestsReceived.includes(friendId)) {
      return res.status(400).json({ message: "This user has already sent you a friend request" });
    }

    // Send friend request
    user.friendRequestsSent.push(friendId);
    friend.friendRequestsReceived.push(id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if there's a pending request
    if (!user.friendRequestsReceived.includes(friendId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Accept the request - add to friends and remove from requests
    user.friends.push(friendId);
    friend.friends.push(id);

    user.friendRequestsReceived = user.friendRequestsReceived.filter(reqId => reqId !== friendId);
    friend.friendRequestsSent = friend.friendRequestsSent.filter(reqId => reqId !== id);

    await user.save();
    await friend.save();

    // Return full friend objects like getUserFriends does
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json({ 
      message: "Friend request accepted",
      friends: formattedFriends // Return full friend objects for consistency
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if there's a pending request
    if (!user.friendRequestsReceived.includes(friendId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Decline the request - remove from both users
    user.friendRequestsReceived = user.friendRequestsReceived.filter(reqId => reqId !== friendId);
    friend.friendRequestsSent = friend.friendRequestsSent.filter(reqId => reqId !== id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are friends
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Not friends with this user" });
    }

    // Remove from friends list
    user.friends = user.friends.filter(fId => fId !== friendId);
    friend.friends = friend.friends.filter(fId => fId !== id);

    await user.save();
    await friend.save();

    // Return full friend objects like getUserFriends does
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json({ 
      message: "Friend removed",
      friends: formattedFriends // Return full friend objects for consistency
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get received friend requests with user details
    const receivedRequests = await Promise.all(
      user.friendRequestsReceived.map((userId) => User.findById(userId))
    );

    const formattedRequests = receivedRequests.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json({
      received: formattedRequests,
      sent: user.friendRequestsSent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};