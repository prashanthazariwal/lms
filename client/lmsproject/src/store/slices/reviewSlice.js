import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const createReviewThunk = createAsyncThunk(
  "reviews/createReview",
  async ({ courseId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.createReview(courseId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createReviewThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createReviewThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
    });
    builder.addCase(createReviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = reviewSlice.actions;
export default reviewSlice.reducer;
