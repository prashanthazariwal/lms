import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

/**
 * Protected Route Component
 *
 * What is a Protected Route?
 * - A route that requires authentication to access
 * - If user is not logged in, redirect to login page
 * - If user is logged in, show the protected content
 *
 * How it works:
 * 1. Check if user is authenticated (from Redux state)
 * 2. If authenticated: render the protected component (children)
 * 3. If not authenticated: redirect to login page
 *
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

function ProtectedRoute({ children }) {
  // Get authentication state from Redux
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // NOTE: Do NOT block on global loading here.
  // Loading can be true while fetching profile on Home, but user is already authenticated.
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute;
