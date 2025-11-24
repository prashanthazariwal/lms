import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCurrentUser, signout } from "../store/slices/authSlice";
import { useState } from "react";
import { useRef } from "react";

/**
 * Home/Dashboard Page
 *
 * This is a protected page - only logged in users can access it
 * Shows user profile and logout functionality
 */

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get user data from Redux state
  const { user, loading } = useAppSelector((state) => state.auth);

  // Fetch current user when component mounts
  // This ensures we have the latest user data
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Welcome, {user?.userName || "User"}! 👋
            </h2>
            <button
              onClick={() => {
                navigate("/edit-profile");
              }}
              className="block w-fit text-left text-sm px-3 py-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-300"
            >
             Edit Profile
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Your Profile
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Username:</span>{" "}
                <span className="text-gray-800">{user?.userName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">descreption:</span>{" "}
                <span className="text-gray-800">{user?.bio}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>{" "}
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Role:</span>{" "}
                <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.role || "student"}
                </span>
              </div>
            </div>
          </div>

          {/* Placeholder for future features */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              🎓 Your Courses
            </h3>
            <p className="text-gray-600">
              {user?.enrolledCourses?.length > 0
                ? `You are enrolled in ${user.enrolledCourses.length} course(s)`
                : "You haven't enrolled in any courses yet."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
