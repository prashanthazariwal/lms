import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signin, clearError } from "../store/slices/authSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utlis/firebase";
import { googleSignup } from "../services/api";

/**
 * Login Page Component
 *
 * What we're learning:
 * 1. Form handling with React state
 * 2. Using Redux hooks (useAppDispatch, useAppSelector)
 * 3. Dispatching async actions (thunks)
 * 4. Handling loading and error states
 * 5. Navigation after successful login
 */

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux store
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  // Local form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts or form changes
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch signin action (async thunk)
    // This will automatically update the Redux state
    const result = await dispatch(signin(formData));

    // If signin successful, navigate to home
    if (signin.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
  const { user } = res;
  // Obtain a server-verifiable idToken from Firebase
  const idToken = await user.getIdToken();
  console.log('Firebase idToken:', idToken); // Add this line to debug

  // Call backend to sign up / sign in the user with idToken
  const result = await googleSignup({ idToken });
      if (result && (result.statusCode === 200 || result.statusCode === 201)) {
        const payload = result.data || {};
        if (payload.accessToken) localStorage.setItem("accessToken", payload.accessToken);
        if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));
        navigate("/");
      } else {
        console.error("googleSignup failed:", result);
        alert("Google login failed. Check console for details.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login to LMS
        </h1>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* OR separator and Google Sign-in button */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px bg-gray-200 flex-1" />
            <span className="text-sm text-gray-400">Or continue with</span>
            <span className="h-px bg-gray-200 flex-1" />
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.5 20H24v8.5h11.9C34.6 32.5 30 36.5 24 36.5c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.6 1.3 9 3.5l6.3-6.3C35.9 3.7 30.4 1.5 24 1.5 11.3 1.5 1.5 11.3 1.5 24S11.3 46.5 24 46.5c12 0 21.9-8.5 21.9-22.5 0-1.5-.2-2.5-.4-3z" fill="#FFC107"/>
              <path d="M6.3 14.7l7.1 5.2C15.8 16.1 19.6 13.5 24 13.5c3.5 0 6.6 1.3 9 3.5l6.3-6.3C35.9 3.7 30.4 1.5 24 1.5 15.1 1.5 7.8 6.9 6.3 14.7z" fill="#FF3D00"/>
              <path d="M24 46.5c6.3 0 11.8-2.1 16-5.7l-7.5-6.1c-2.2 1.7-5 2.7-8.5 2.7-6 0-10.6-4-12-9.4l-7.2 5.5C9 40.4 15.6 46.5 24 46.5z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.9C35 30.2 30.9 32.5 24 32.5c-6.3 0-11.6-3.8-13.5-9.1l-7.1 5.2C9 40.4 15.6 46.5 24 46.5c12 0 21.9-8.5 21.9-22.5 0-1.5-.2-2.5-.4-3z" fill="#1976D2"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>
        <h4
          onClick={() => {
            navigate("/forget-password");
          }}
          className="text-center font-medium cursor-pointer text-gray-600 mt-4 text-sm"
        >
          froget your password ?
        </h4>

        {/* Signup link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
