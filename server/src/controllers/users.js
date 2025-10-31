import User from "../models/User.js";

/* READ */
const getCurrentUser = async (req, res) => {
  return res
  .status(200)
  .json({user: req.user, msg: "User fetched successfully"});
};

export { getCurrentUser };
