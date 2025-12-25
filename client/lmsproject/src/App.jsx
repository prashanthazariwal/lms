import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Layout from "./layouts/Layout"; // 👈 Import the new layout component
import EditCource from "./pages/EditCource";
import AllCourcesPage from "./pages/AllCourcesPage";
import CreateLecturePage from "./pages/CreateLecturePage";
import ViewCoursePage from "./pages/ViewCoursePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* ---------- Protected Routes (with shared Navbar) ---------- */}
        <Route
          element={
            <ProtectedRoute>
              <Layout /> {/* 👈 Wrap protected pages in Layout */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          {/* You can add more protected pages here, e.g.: */}
          <Route path="/instructor/dashboard" element={<Dashboard />} />
          <Route path="/instructor/editCourse/:courseId" element={<EditCource />} />
          <Route path="/instructor/add-lecture/:courseId" element={<CreateLecturePage />} />
          <Route path="/all-cources" element={<AllCourcesPage />} />
          <Route path="/view-course/:courseId" element={<ViewCoursePage/>} />
        </Route>

        {/* ---------- Redirect unknown routes ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
