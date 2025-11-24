import { Router } from "express";
import {
  signin,
  signout,
  signup,
  getCurrentUser,
  updateProfile,
  refreshAccessToken,
  sentOtp,
  verifyOtp,
  resetPassword,
  googleSignUp,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadProfilePic } from "../controllers/userController.js";

const router = Router();

// PUBLIC routes - Anyone can access these
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh-token", refreshAccessToken); // Refresh token endpoint (uses cookie, no auth needed)
router.post("/google-signup", googleSignUp)

// Forget Password routes
router.post("/forgot-password/send-otp", sentOtp);
router.post("/forgot-password/verify-otp", verifyOtp);
router.post("/forgot-password/reset", resetPassword);

// PROTECTED routes - Requires authentication
// Notice how we add 'authenticate' middleware before the controller
// This means: First authenticate, then if successful, run getCurrentUser
router.get("/me", authenticate, getCurrentUser);
router.patch("/me", authenticate, uploadProfilePic, updateProfile);

// Example of role-based route (only admins can access)
// router.get('/admin/users', authenticate, authorize('admin'), getAllUsers);

export default router;
