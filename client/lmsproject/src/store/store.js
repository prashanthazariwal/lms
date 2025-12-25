import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import courseReducer from "./slices/courseSlice";
import lectureReducer from "./slices/lectureSlice";
/**
 * Redux Store Configuration
 *
 * What is Redux?
 * - Redux is a state management library for React
 * - It stores all your app's state in ONE place (called "store")
 * - Components can read state from store and update it using "actions"
 *
 * Why Redux Toolkit?
 * - Official recommended way to write Redux code
 * - Less boilerplate code (no need to write actions/reducers manually)
 * - Built-in support for async operations (thunks)
 * - Better developer experience
 *
 * How it works:
 * 1. Store = Global state container
 * 2. Slices = Different parts of state (auth, courses, etc.)
 * 3. Actions = Functions that update state
 * 4. Components = Use hooks to read/update state
 */

export const store = configureStore({
  reducer: {
    // Each slice represents a different part of your app state
    auth: authReducer, // Auth state (user, tokens, loading, etc.)
    profile: profileReducer, // Profile state (user, upload progress, etc.)
    // Later you can add more slices:
    courses: courseReducer,
    lectures: lectureReducer,
    // students: studentReducer,
  },
});
