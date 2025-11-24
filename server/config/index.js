import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB
    // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
    // Modern Mongoose automatically uses these options, so we don't need to specify them
    const connection = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lms"
    );

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Re-throw error so the calling code (index.js) can handle it properly
    throw err;
  }
};

export default connectDB;
