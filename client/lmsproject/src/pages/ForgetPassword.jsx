import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, resetPassword } from "../services/api.js";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Handle email input for step 1
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  // Handle form input changes for step 2 and 3
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await sendOtp(email);
      if (response.statusCode === 200) {
        setStep(2);
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.otp || formData.otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(email, formData.otp);
      if (response.statusCode === 200) {
        setStep(3);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, formData.password);
      if (response.statusCode === 200) {
        // Password reset successful, redirect to login
        navigate("/login", {
          state: { message: "Password reset successfully! Please login." },
        });
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {step === 1 && (
        <div className="max-w-md w-full p-8 rounded-xl bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            Forgot Password
          </h1>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
          <h4
            onClick={() => {
              navigate("/login");
            }}
            className="text-xs font-semibold hover:text-slate-900 text-slate-700 mt-4 text-center cursor-pointer"
          >
            Back to login
          </h4>
        </div>
      )}
      {step === 2 && (
        <div className="max-w-md w-full p-8 rounded-xl bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            Enter your OTP
          </h1>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Please enter your 4 digit code sent to your email.
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength={4}
                pattern="[0-9]{4}"
                className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter 4-digit OTP"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <div className="mt-4 flex justify-between items-center">
            <h4
              onClick={() => {
                setStep(1);
                setError("");
                setFormData({ ...formData, otp: "" });
              }}
              className="text-xs font-semibold hover:text-slate-900 text-slate-700 cursor-pointer"
            >
              Back
            </h4>
            <h4
              onClick={() => {
                navigate("/login");
              }}
              className="text-xs font-semibold hover:text-slate-900 text-slate-700 cursor-pointer"
            >
              Back to login
            </h4>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="max-w-md w-full p-8 rounded-xl bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            Reset your password
          </h1>
          <h2 className="text-sm font-bold text-center mb-6 text-gray-700">
            Enter a new password below to regain access to your account
          </h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
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
                className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="**********"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="**********"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <h4
            onClick={() => {
              navigate("/login");
            }}
            className="text-xs font-semibold hover:text-slate-900 text-slate-700 mt-4 text-center cursor-pointer"
          >
            Back to login
          </h4>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
