import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';

/**
 * Middleware to verify JWT tokens in incoming requests.
 * Ensures that only authenticated users can access protected routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = async (req, res, next) => {
    try {
        // Retrieve token from the Authorization header
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token is provided, deny access
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Fetch the user associated with the token
        const user = await User.findById(verified._id).select("-password -refreshToken -__v");

        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        // Attach the user info to the request object
        req.user = user;

        // Proceed to the next middleware or route handler 
        next();
    } catch (err) {
        // Return error if token verification fails
        res.status(500).json({ error: err.message });
    }
};

export default verifyToken;
