import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

/**
 * Redux Slice - Authentication State Management
 *
 * What is a Slice?
 * - A slice is a collection of Redux reducer logic and actions
 * - It contains: initial state, reducers (synchronous), and async thunks
 *
 * What is createAsyncThunk?
 * - Used for async operations (API calls)
 * - Automatically handles loading, success, and error states
 * - Makes it easy to handle async data fetching
 */

// Helper function to safely parse JSON from localStorage
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    // If JSON is invalid, clear it and return null
    localStorage.removeItem("user");
    return null;
  }
};

// Initial state - starting point of auth state
const initialState = {
  user: getStoredUser(), // User object from localStorage if exists
  accessToken: localStorage.getItem("accessToken") || null, // Access token from localStorage
  isAuthenticated: !!localStorage.getItem("accessToken"), // Check if token exists
  loading: false, // Loading state for async operations
  error: null, // Error message if any operation fails
};

/**
 * Async Thunks - For API calls
 * These are action creators that return a function (thunk)
 * Redux Toolkit handles the async logic automatically
 */

// Signup thunk
export const signup = createAsyncThunk(
  "auth/signup", // Action type prefix
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.signup(userData);
      // API returns: { message, statusCode, data: user }
      return response;
    } catch (error) {
      // Return error message to be handled in reducer
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

// Signin thunk
export const signin = createAsyncThunk(
  "auth/signin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.signin(email, password);
      // API returns: { message, statusCode, data: { user, accessToken } }

      // Save token and user to localStorage
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Signin failed");
    }
  }
);

// Signout thunk
export const signout = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      await api.signout();

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return null;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return rejectWithValue(error.message || "Signout failed");
    }
  }
);

// Get current user thunk (for checking if user is still logged in)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCurrentUser();
      // API returns: { message, statusCode, data: user }
      return response.data;
    } catch (error) {
      // If getCurrentUser fails, clear auth state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return rejectWithValue(error.message || "Failed to get user");
    }
  }
);

/**
 * Auth Slice
 * Contains:
 * - name: Used in action types
 * - initialState: Starting state
 * - reducers: Synchronous state updates (not async)
 * - extraReducers: Handle async thunk states (pending, fulfilled, rejected)
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous reducer to clear errors
    clearError: (state) => {
      state.error = null;
    },
    // Synchronous reducer to update user (for profile updates)
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Signup doesn't automatically log in user (optional: you can add it)
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signin cases
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Signout cases
      .addCase(signout.pending, (state) => {
        state.loading = true;
      })
      .addCase(signout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signout.rejected, (state, action) => {
        state.loading = false;
        // Even if API call fails, clear local state
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

// Export actions (synchronous reducers)
export const { clearError, updateUser } = authSlice.actions;

// Export reducer (to be used in store)
export default authSlice.reducer;
