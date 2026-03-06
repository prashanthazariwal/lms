import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../services/api";

const initialState = {
  loading: false,
  error: null,
  currentOrder: null,
  paymentStatus: null,
};
// Async Thunks - For API calls related to lectures
export const createOrderThunk = createAsyncThunk(
  "orders/createOrders",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await api.createRazerpayOrder(courseId);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  "orders/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.verifyPaymentApi(paymentData);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to verify payment");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(createOrderThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(verifyPaymentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyPaymentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.paymentStatus = action.payload;
    });
    builder.addCase(verifyPaymentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = orderSlice.actions;
export default orderSlice.reducer;
