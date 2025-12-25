import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import sendMail from "../config/sendMail.js";
import fs from "fs";
import { dirname as _dirnameFn } from 'path';
import cloudinary from "../config/cloudinary.js";
import { uploadImage } from "../config/multerConfig.js";
import safeUnlink from "../utils/safeUnlick.js";

// process.env.NODE_ENV === "production"
// Cookie options for refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function parseCookie(headerCookie, userName) {
  if (!headerCookie) return null;
  const pairs = headerCookie.split(";").map((c) => c.trim());
  for (const p of pairs) {
    const [k, v] = p.split("=");
    if (k === userName) return decodeURIComponent(v);
  }
  return null;
}

export const uploadProfilePic = uploadImage.single('profilePicture');



export const signup = async (req, res) => {
  try {
    const { userName, email, password, role = "student" } = req.body;

    // Log which fields are missing
    const missingFields = [];
    if (!userName) missingFields.push("userName");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      throw new ApiError(
        `Required fields missing: ${missingFields.join(", ")}`,
        400
      );
    }

    // checking user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("User already exists", 409);
    }
    if (password.length < 6) {
      throw new ApiError("Password must be at least 6 characters long", 400);
    }
    if (!validator.isEmail(email)) {
      throw new ApiError("Invalid email format", 400);
    }

    // Prefer letting model's pre('save') hash the password:
    const newUser = await User.create({
      userName,
      email,
      password, // plaintext — will be hashed by model pre-save
      role,
    });

    //fetch created user without sensitive info
    const userToReturn = await User.findById(newUser._id).select(
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    if (!newUser) {
      throw new ApiError("User registration failed", 500);
    }

    return res
      .status(201)
      .json(new ApiResponse("User registered successfully", 201, userToReturn));
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token on user (for revocation/rotation)
    user.refreshToken = refreshToken;
    await user.save();

    // Set httpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const userToReturn = await User.findById(user._id).select(
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    return res.status(200).json(
      new ApiResponse("Signed in successfully", 200, {
        user: userToReturn,
        accessToken,
      })
    );
  } catch (error) {
    console.error("Signin error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res
      .status(500)
      .json(new ApiResponse("Internal server error", 500, null));
  }
};

export const signout = async (req, res) => {
  try {
    // Try to get refresh token from cookie (req.cookies if cookie-parser used)
    const refreshToken =
      req.cookies?.refreshToken ||
      parseCookie(req.headers?.cookie, "refreshToken");

    if (!refreshToken) {
      // Nothing to do, but clear cookie on client anyway
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(200).json(new ApiResponse("Logged out", 200, null));
    }

    // Find user by refreshToken
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    // Clear cookie
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json(new ApiResponse("Logged out", 200, null));
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json(new ApiResponse("Internal server error", 500, null));
  }
};

/**
 * Refresh Access Token
 * This endpoint uses refresh token (from cookie) to get a new access token
 * Why we need this: Access tokens expire quickly (15 min) for security
 * Refresh tokens last longer (7 days) and are used to get new access tokens
 *
 * Flow:
 * 1. Frontend sends request (refresh token automatically sent in cookie)
 * 2. Backend validates refresh token
 * 3. If valid, generate new access token
 * 4. Return new access token to frontend
 */
export const refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken =
      req.cookies?.refreshToken ||
      parseCookie(req.headers?.cookie, "refreshToken");

    if (!refreshToken) {
      throw new ApiError("Refresh token not found", 401);
    }

    // Find user by refresh token
    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new ApiError("Invalid refresh token", 401);
    }

    // Verify refresh token is valid (not expired)
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      // Refresh token expired or invalid
      user.refreshToken = null;
      await user.save();
      res.clearCookie("refreshToken", { path: "/" });
      throw new ApiError("Refresh token expired", 401);
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    // Optionally: Generate new refresh token (token rotation - more secure)
    // For now, we'll keep the same refresh token
    // const newRefreshToken = user.generateRefreshToken();
    // user.refreshToken = newRefreshToken;
    // await user.save();
    // res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json(
      new ApiResponse("Access token refreshed successfully", 200, {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res
      .status(500)
      .json(new ApiResponse("Internal server error", 500, null));
  }
};

/**
 * Get current user profile
 * This is a PROTECTED route - requires authentication
 * The authenticate middleware sets req.user, so we can access it here
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    // We don't need to find user again - middleware already did that!
    return res
      .status(200)
      .json(
        new ApiResponse("User profile retrieved successfully", 200, req.user)
      );
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json(new ApiResponse("Internal server error", 500, null));
  }
};

export const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError("Email is required", 400);
    }

    if (!validator.isEmail(email)) {
      throw new ApiError("Invalid email format", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    try {
      await sendMail(email, otp);
    } catch (mailError) {
      console.error("Email sending error:", mailError);
      // If email fails, we still want to inform the user
      // In production, you might want to handle this differently
      if (mailError.message.includes("credentials")) {
        throw new ApiError(
          "Email service not configured. Please contact administrator.",
          500
        );
      }
      throw new ApiError("Failed to send email. Please try again later.", 500);
    }

    return res
      .status(200)
      .json(new ApiResponse("OTP sent successfully", 200, null));
  } catch (error) {
    console.error("Send OTP error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res
      .status(500)
      .json(new ApiResponse("Failed to send OTP", 500, null));
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError("Email and OTP are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (!user.resetOtp) {
      throw new ApiError("No OTP found. Please request a new OTP", 400);
    }

    if (user.resetOtp !== otp) {
      throw new ApiError("Invalid OTP", 400);
    }

    if (user.otpExpires < Date.now()) {
      throw new ApiError("OTP has expired. Please request a new OTP", 400);
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse("OTP verified successfully", 200, null));
  } catch (error) {
    console.error("Verify OTP error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res
      .status(500)
      .json(new ApiResponse("Failed to verify OTP", 500, null));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }

    if (password.length < 6) {
      throw new ApiError("Password must be at least 6 characters long", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (!user.isOtpVerified) {
      throw new ApiError(
        "OTP verification is required. Please verify OTP first",
        400
      );
    }

    // Update password - the pre-save hook will hash it automatically
    user.password = password;
    user.isOtpVerified = false;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse("Password reset successfully", 200, null));
  } catch (error) {
    console.error("Reset password error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res
      .status(500)
      .json(new ApiResponse("Failed to reset password", 500, null));
  }
};


export const googleSignUp = async (req, res) => {
  try {
    // NOTE: Google verification disabled per request. The backend will accept
    // client-provided email / userName and create or sign-in the user.
    // This is less secure because the server is trusting client data.
    const { email, userName, role = "student" } = req.body;

    if (!email) {
      throw new ApiError("Email is required", 400);
    }

    if (!validator.isEmail(email)) {
      throw new ApiError("Invalid email format", 400);
    }

    // If user exists, sign them in
    let user = await User.findOne({ email });
    if (user) {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
      const userToReturn = await User.findById(user._id).select(
        "-password -__v -createdAt -updatedAt -refreshToken"
      );
      return res
        .status(200)
        .json(new ApiResponse("User signed in", 200, { user: userToReturn, accessToken }));
    }

    // Create new user using client-provided userName (fallback to email prefix)
    const resolvedUserName = userName || email.split("@")[0];
    user = await User.create({ userName: resolvedUserName, email, role });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const userToReturn = await User.findById(user._id).select(
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse("User registered successfully", 201, { user: userToReturn, accessToken }));
  } catch (error) {
    console.error("Google Signup error:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res.status(500).json(new ApiResponse("Internal server error", 500, null));
  }
};

export const updateProfile = async (req, res) => {
  try {
    // req.user should be set by authenticate middleware
    const userId = req.user?._id;
    if (!userId) throw new ApiError('Unauthorized', 401);

    const user = await User.findById(userId);
    if (!user) throw new ApiError('User not found', 404);

    const { userName, bio } = req.body || {};
    if (userName) user.userName = userName;
    if (bio) user.bio = bio;

    // If a file was uploaded, upload to Cloudinary and replace previous
    if (req.file) {
      const localPath = req.file.path;
      try {
        const uploadRes = await cloudinary.uploader.upload(localPath, {
          folder: `users/${user._id}`,
          transformation: { width: 400, height: 400, crop: 'fill', gravity: 'face', fetch_format: 'auto', quality: 'auto' },
        });

        // Delete old image from Cloudinary if present
        if (user.profilePicturePublicId) {
          try {
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
          } catch (destroyErr) {
            console.warn('Failed to delete previous Cloudinary image', destroyErr);
          }
        }

        user.profilePictureUrl = uploadRes.secure_url;
        user.profilePicturePublicId = uploadRes.public_id;
      } finally {
        // remove temp file
        await safeUnlink(localPath);
      }
    }

    await user.save();

    const userToReturn = await User.findById(user._id).select(
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    return res.status(200).json(new ApiResponse('Profile updated successfully', 200, userToReturn));
  } catch (error) {
    console.error('Update profile error:', error);
    if (req.file && req.file.path) {
      // cleanup temp file on error
      await safeUnlink(req.file.path);
    }
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 500).json(new ApiResponse(error.message, error.statusCode, null));
    }
    return res.status(500).json(new ApiResponse('Internal server error', 500, null));
  }
};