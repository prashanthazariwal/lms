import axios from "axios";

/**
 * API Service - Centralized API Configuration
 *
 * Why create this file?
 * - All API calls in one place = easy to maintain
 * - If backend URL changes, update only here
 * - Can add interceptors for automatic token handling
 * - Consistent error handling across the app
 */

// Base URL for backend API
// In development: backend runs on port 5000
// In production: use your deployed backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Allows cookies (refreshToken) to be sent
});

/**
 * Request Interceptor
 * This runs BEFORE every API request
 * Use it to add the access token to Authorization header
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * This runs AFTER every API response
 * Use it to handle errors globally (like token expiration)
 *
 * IMPORTANT: Refresh Token Flow
 * When access token expires (401 error):
 * 1. Try to refresh the access token using refresh token (from cookie)
 * 2. If refresh succeeds, retry the original request with new token
 * 3. If refresh fails, redirect to login
 */
let isRefreshing = false; // Flag to prevent multiple refresh requests
let failedQueue = []; // Queue for failed requests while refreshing

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error response exists
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong";

      // Handle 401 (Unauthorized) - Token expired or invalid
      if (status === 401 && !originalRequest._retry) {
        // Check if we're already refreshing
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Mark this request as retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the access token
          // Refresh token is automatically sent in cookie (withCredentials: true)
          const refreshResponse = await api.post("/users/refresh-token");
          const newAccessToken = refreshResponse.data.data?.accessToken;

          if (newAccessToken) {
            // Save new token
            localStorage.setItem("accessToken", newAccessToken);

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Process queued requests
            processQueue(null, newAccessToken);

            // Retry the original request
            isRefreshing = false;
            return api(originalRequest);
          } else {
            throw new Error("No access token in refresh response");
          }
        } catch (refreshError) {
          // Refresh failed - clear everything and redirect to login
          processQueue(refreshError, null);
          isRefreshing = false;

          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");

          // Only redirect if not already on login page
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }

          return Promise.reject({
            message: "Session expired. Please login again.",
            status: 401,
          });
        }
      }

      // Return a consistent error format
      return Promise.reject({
        message,
        status,
        data: error.response.data,
      });
    }

    // Network error (backend not reachable)
    return Promise.reject({
      message: "Network error. Please check your connection.",
      status: 0,
    });
  }
);

/**
 * Auth API Functions
 * These functions call the backend authentication endpoints
 */

// Signup
export const signup = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data; // Returns: { message, statusCode, data }
};

// Signin
export const signin = async (email, password) => {
  const response = await api.post("/users/signin", { email, password });
  return response.data; // Returns: { message, statusCode, data: { user, accessToken } }
};

// Google signup / signin (backend endpoint)
export const googleSignup = async (payload) => {
  const response = await api.post("/users/google-signup", payload);
  return response.data; // Returns: { message, statusCode, data: { user, accessToken } }
};

// Signout
export const signout = async () => {
  const response = await api.post("/users/signout");
  return response.data;
};

// Get current user (protected route)
export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data; // Returns: { message, statusCode, data: user }
};

// Update profile (PATCH /users/me)
export const updateProfileApi = async (formData, onUploadProgress) => {
  // formData: FormData object with userName, bio, profilePicture (file)
  const response = await api.patch("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response;
};

// Refresh access token (uses refresh token from cookie)
export const refreshAccessToken = async () => {
  const response = await api.post("/users/refresh-token");
  return response.data; // Returns: { message, statusCode, data: { accessToken } }
};

// Forget Password API Functions
export const sendOtp = async (email) => {
  const response = await api.post("/users/forgot-password/send-otp", { email });
  return response.data; // Returns: { message, statusCode, data }
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/users/forgot-password/verify-otp", {
    email,
    otp,
  });
  return response.data; // Returns: { message, statusCode, data }
};

export const resetPassword = async (email, password) => {
  const response = await api.post("/users/forgot-password/reset", {
    email,
    password,
  });
  return response.data; // Returns: { message, statusCode, data }
};

export const createCourse = async (courseData) => {
  const response = await api.post("/courses/create-course", courseData);
  return response.data; // Returns: { message, statusCode, data }
}

export const getAllPublishedCourses = async () => {
  const response = await api.get("/courses/published");
  return response.data; // Returns: { message, statusCode, data: courses }
}
export const getCreatorCourses = async () => {
  const response = await api.get("/courses/creator-courses");
  return response.data; // Returns: { message, statusCode, data: courses }
}
export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data; // Returns: { message, statusCode, data: course }
}
export const editCourse = async (courseId , updatedData) =>{
  const response = await api.patch(`/courses/editcourse/${courseId}`, updatedData , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}
export const deleteCourse = async (courseId) =>{
  const response = await api.delete(`/courses/remove/${courseId}`)
  return response.data
}




export default api;
