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
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  // Get user data from Redux state
  const { user, loading } = useAppSelector((state) => state.auth);

  // Fetch current user when component mounts
  // This ensures we have the latest user data
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await dispatch(signout());
    navigate("/login");
  };

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
        home page
      </main>
    </div>
  );
}

export default Home;
