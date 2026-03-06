import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signout } from "../store/slices/authSlice";

import HeroSection from "../sections/HeroSection";
import ExploreCources from "../sections/ExploreCources";
import PopularCources from "../sections/PopularCources";
import AboutSection from "../sections/AboutSection";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  // Get auth state (DO NOT fetch here)
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

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

  const handleLogout = async () => {
    await dispatch(signout());
    navigate("/login");
  };

  // Optional: show loader ONLY if auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4">
        <HeroSection />
        <ExploreCources />
        <PopularCources />
        <AboutSection />
      </main>
    </>
  );
}

export default Home;
