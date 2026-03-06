import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCurrentUser } from "../store/slices/authSlice";
import { BookOpen } from "lucide-react";
import Button from "../components/Button";

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
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-lg p-8 bg-linear-to-l from-blue-50 to-neutral-50">
          <div className="flex justify-between items-center ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 font-StackSansHeadline">
              Welcome, {user?.userName || "User"}! 👋
            </h2>
            <button
              onClick={() => {
                navigate("/edit-profile");
              }}
              className="block w-fit text-left text-sm px-3 py-2 rounded cursor-pointer bg-neutral-50 hover:bg-neutral-100 border border-neutral-200"
            >
              Edit Profile
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-linear-to-r from-blue-50 to-neutral-50 rounded-lg p-6 mb-6">
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

          <div className="mt-8 p-6 bg-gray-50 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              🎓 Your Courses
            </h3>
            <p className="text-gray-600">
              {user?.enrolledCourses?.length > 0
                ? `You are enrolled in ${user.enrolledCourses.length} course(s)`
                : "You haven't enrolled in any courses yet."}
            </p>
            <div className="mt-4">
              {user?.enrolledCourses?.map((course) => (
                <div
                  key={course._id}
                  onClick={() => {}}
                  className=" hover:shadow-2xs hover:shadow-cyan-500 transition-all w-[20vw] bg-white rounded-lg p-4 flex flex-col justify-between border border-neutral-200 "
                >
                  <div>
                    <div className="w-full h-40 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h2 className="font-display text-lg font-bold text-neutral-800">
                      {course.title}
                    </h2>
                    <p className="text-sm font-semibold text-blue-700">
                      {course.category}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 tracking-wide leading-4 font-semibold mb-8 line-clamp-2 text-container mt-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="  border-neutral-300 rounded-xl text-green-600 font-semibold inline-block">
                        {course.level}
                      </span>
                      <Button
                        children={"Exploure Cource"}
                        variant="outline"
                        className=""
                        onClick={() => navigate(`/view-course/${course._id}`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
