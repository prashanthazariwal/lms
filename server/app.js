import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration - Security Best Practice
// Why CORS matters: Browsers block cross-origin requests by default for security
// We need to explicitly allow our frontend to communicate with our backend
const corsOptions = {
   origin: "http://localhost:5173", // 👈 EXACT frontend URL
  credentials: true, // Important: Allows cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions)); // Use configured CORS instead of open CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies from requests

// Error handling middleware - Must be AFTER routes
// Why after routes? So it can catch errors from route handlers
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS: Request from this origin is not allowed",
    });
  }

  // Handle other errors
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong!",
    // Only show stack trace in development (not in production for security)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// routes
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

export default app;
