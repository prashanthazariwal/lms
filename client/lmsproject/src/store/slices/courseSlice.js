import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

// Initial state for course management
const initialState = {
  courses: [], // List of published courses
  creatorCourses: [], // Courses created by the current user
  courseDetails: null, // Details of a single course
  loading: false, // Loading state for async operations
  error: null, // Error message if any operation fails
};
// Async Thunks - For API calls related to courses
// Fetch all published courses
export const fetchPublishedCourses = createAsyncThunk(
  "courses/fetchPublished",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllPublishedCourses();
      return response.data; // Returns: { message, statusCode, data: courses }
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch published courses"
      );
    }
  }
);
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createCourse(formData);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create course");
    }
  }
);
export const getCreatorCourses = createAsyncThunk(
  "courses/getCreatorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCreatorCourses();
      return response.data; // Returns: { message, statusCode, data: courses }
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch creator courses"
      );
    }
  }
);
export const getCourseDetails = createAsyncThunk(
  "courses/getCourseDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.getCourseById(courseId);
      return response.data; // Returns: { message, statusCode, data: course }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch course details");
    }
  }
);
export const editCourse = createAsyncThunk(
  "courses/editCourse",
  async ({ courseId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.editCourse(courseId, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update courseDetails");
    }
  }
);
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.deleteCourse(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete course");
    }
  }
);
// Course Slice
const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCreatorCourses(state, action) {
      state.creatorCourses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchPublishedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.creatorCourses.push(action.meta.arg); // 👈 Add new course immediately
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getCreatorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCreatorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.creatorCourses = action.payload;
      })
      .addCase(getCreatorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload;
      })
      .addCase(getCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(editCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload; // updated course
        // Also update creatorCourses list if you keep it in state:
        state.creatorCourses = state.creatorCourses.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        // action.meta.arg is the courseId that was passed to the thunk
        state.creatorCourses = state.creatorCourses.filter(
          (course) => course._id !== action.meta.arg
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setCreatorCourses } = courseSlice.actions;
export default courseSlice.reducer;
