import dotenv from "dotenv";
// Load environment variables from .env file in the root directory
dotenv.config({
  path: '.env'
});
import fs from "fs";
import path from "path";





const envPath = path.resolve('.env');
console.log("Looking for .env at:", envPath);
console.log("Exists:", fs.existsSync(envPath));
console.log("Cloud name raw value:", process.env.CLOUDINARY_CLOUD_NAME);
// Import and run email configuration validation
import { validateEmailConfig } from './config/checkEmailConfig.js';

try {
  validateEmailConfig();
  console.log('Email configuration validated successfully');
} catch (error) {
  console.error('Email configuration validation failed:', error.message);
  // Optionally exit if email config is required:
  // process.exit(1);
}

import connectDB from "./config/index.js";
import app from "./app.js";
// MongoDB Connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
