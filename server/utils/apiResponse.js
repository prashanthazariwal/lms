/**
 * ApiResponse - A standardized response class for successful API responses
 *
 * Why this class exists:
 * - Consistency: All successful responses follow the same structure
 * - Easy to understand: Frontend knows exactly what to expect
 * - Maintainability: If response format changes, update only here
 */
class ApiResponse {
  constructor(message, statusCode, data) {
    this.message = message; // Success message (e.g., "User registered successfully")
    this.statusCode = statusCode; // HTTP status code (e.g., 200, 201)
    this.data = data; // Actual data to return (user object, course list, etc.)

    // Note: We DON'T use Error.captureStackTrace here because:
    // 1. This is NOT an Error class - it's for successful responses
    // 2. Stack traces are only useful for debugging errors
    // 3. Adding stack traces to success responses wastes memory and adds confusion
    // 4. Error.captureStackTrace is meant for Error objects, not response objects
  }
}

export default ApiResponse;
