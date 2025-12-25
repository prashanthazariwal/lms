import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../services/api";

const initialState = {
  lectures: [],
};
// Async Thunks - For API calls related to lectures
export const createLectureThunk = createAsyncThunk(
  "lectures/createLecture",
  async ({ courseId, lectureData }, { rejectWithValue }) => {
    try {
      const response = await api.createLecture(courseId, lectureData);
      console.log(response)
        return response; 
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create lecture");
    }
  }
);
export const getLecturesByCourseThunk = createAsyncThunk(
  "lectures/getLecturesByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.getLecturesByCourse(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch lectures");
    }
    }
);
export const editLectureThunk = createAsyncThunk(
  "lectures/editLecture",
  async ({ lectureId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.editLecture(lectureId, updatedData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to edit lecture");
    }
    }
);

const lectureSlice = createSlice({
  name: "lectures",
  initialState, 
    reducers: {},
    extraReducers: (builder) => {
    builder.addCase(createLectureThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createLectureThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.lectures.push(action.payload);
    });
    builder.addCase(createLectureThunk.rejected, (state, action) => {
      state.loading = false;
        state.error = action.payload;
    });
    builder.addCase(getLecturesByCourseThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getLecturesByCourseThunk.fulfilled, (state, action) => {
      state.loading = false;
        state.lectures = action.payload;
    });
    builder.addCase(getLecturesByCourseThunk.rejected, (state, action) => {
      state.loading = false;
        state.error = action.payload;
    });
    builder.addCase(editLectureThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editLectureThunk.fulfilled, (state, action) => {
      state.loading = false;
        const index = state.lectures.lectures?.data?.findIndex(
          (lecture) => lecture._id === action.payload._id
        );
        if (index !== -1) {
          state.lectures[index] = action.payload;
        }
    });
    builder.addCase(editLectureThunk.rejected, (state, action) => {
      state.loading = false;
        state.error = action.payload;
    });
    },

});

export const {} = lectureSlice.actions;

export default lectureSlice.reducer;
