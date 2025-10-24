import jwt from 'jsonwebtoken';

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
        let token = req.header("Authorization");

        // If no token is provided, deny access
        if (!token) {
            return res.status(403).send("Access Denied!");
        }

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the verified user info to the request object
        req.user = verified;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Return error if token verification fails
        res.status(500).json({ error: err.message });
    }
};

export default verifyToken;
