import User from "../models/User.js";

/* READ */
const getCurrentUser = async (req, res) => {
  return res
  .status(200)
  .json({user: req.user, msg: "User fetched successfully"});
};

const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        bio,
      },
      { new: true }
    ).select("-password -refreshToken -__v");

    return res
      .status(200)
      .json({ user: updatedUser, msg: "User details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateProfilePicture = async (req, res) => {
  try {
    const picturePath = req.file?.path;

    if (!picturePath) {
      return res.status(400).json({ error: "No picture file provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { picturePath },
      { new: true }
    ).select("-password -refreshToken -__v");

    return res
      .status(200)
      .json({ user: updatedUser, msg: "Profile picture updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getCurrentUser, updateUserDetails, updateProfilePicture };
