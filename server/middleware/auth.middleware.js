import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

/**
 * Authentication Middleware
 *
 * What is middleware?
 * - Middleware functions run between the request and the route handler
 * - They can modify the request, check permissions, or block requests
 * - Think of it as a security guard checking your ID before letting you in
 *
 * Why do we need this?
 * - Not all routes should be accessible to everyone
 * - Some routes need the user to be logged in (authenticated)
 * - We need to verify the JWT token to know who is making the request
 */

/**
 * Middleware to verify JWT access token
 * This middleware:
 * 1. Extracts the token from Authorization header
 * 2. Verifies the token is valid
 * 3. Finds the user from the database
 * 4. Attaches user info to req object so routes can use it
 */
export const authenticate = async (req, res, next) => {
  try {
    // Step 1: Get token from Authorization header
    // Frontend sends: Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("No token provided or invalid format", 401);
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7); // "Bearer abc123" -> "abc123"

    // Step 2: Verify token using JWT_SECRET
    // If token is invalid/expired, jwt.verify will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Find user in database
    // Why check database? User might have been deleted, or token might be from old session
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError("User not found", 401);
    }

    // Step 4: Attach user to request object
    // Now any route handler after this middleware can access req.user
    req.user = user;

    // Step 5: Call next() to continue to the next middleware/route handler
    next();
  } catch (error) {
    // Handle JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(new ApiResponse("Invalid token", 401, null));
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(new ApiResponse("Token expired", 401, null));
    }

    // Handle other errors
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }

    return res
      .status(500)
      .json(new ApiResponse("Authentication failed", 500, null));
  }
};

/**
 * Optional: Role-based authorization middleware
 * Use this AFTER authenticate middleware
 * Example: router.get('/admin/dashboard', authenticate, authorize('admin'), adminDashboard)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // authenticate middleware should have set req.user
    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse("Authentication required", 401, null));
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            "You don't have permission to access this resource",
            403,
            null
          )
        );
    }

    next();
  };
};
