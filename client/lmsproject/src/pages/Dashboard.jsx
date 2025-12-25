import React, { useEffect } from "react";
import { BookOpen, Edit, LeafyGreen } from "lucide-react";
import CreateCourseModel from "../components/CreateCourseModel";
import { useDispatch } from "react-redux";
import { getCreatorCourses } from "../store/slices/courseSlice";
import { useAppSelector } from "../store/hooks.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { creatorCourses, loading, error } = useAppSelector((state) => state.courses);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch creator courses from the API and update state
    // For now, using static data defined above
    dispatch(getCreatorCourses());
  }, [dispatch]);

  return (
    <>
      {isModelOpen && (
        <CreateCourseModel
          isModelOpen={isModelOpen}
          setIsModelOpen={setIsModelOpen}
        />
      )}
      <div className="min-h-screen flex justify-center font-Montserrat">
        <div className="max-w-7xl w-full  flex flex-col mt-10 h-fit ">
          <header className="flex justify-between items-center border-t border-blue-500 pt-4 pb-6  md:px-0">
            <div className="flex flex-col gap-3">
              <h1 className="font-semibold text-4xl font-StackSansHeadline text-neutral-800">
                My Cources
              </h1>
              <h4 className="font-semibold text-md text-neutral-600">
                Manage and create your cources
              </h4>
            </div>

            <button
              onClick={() => setIsModelOpen(!isModelOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-5 hover:bg-blue-600 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-square-pen-icon lucide-square-pen"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
              <span>Create Cource</span>
            </button>
          </header>
          <div>
            {creatorCourses.length === 0 ? (
              <p className="text-center text-neutral-600 mt-20">
                You have not created any courses yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
                {creatorCourses.map((course) => (
                  <div
                    key={course?._id}
                    className=" hover:shadow-2xs hover:shadow-cyan-500 transition-all w-[20vw] bg-white rounded-lg p-4 flex flex-col justify-between"
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
                      <h2 className="font-display text-lg font-semibold text-neutral-800">
                        {course.title}
                      </h2>
                      <p className="text-sm font-semibold text-neutral-500">
                        {course.category}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600 font-semibold mt-8 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex gap-4">
                        <button
                          variant="outline"
                          className="flex-1 border border-neutral-300 rounded-xl hover:bg-neutral-100 flex items-center justify-center p-2"
                          onClick={() => navigate(`/instructor/editCourse/${course._id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                        <div
                          onClick={() =>
                            togglePublish(course.id, course.isPublished)
                          }
                          className={`px-4 border ${
                            course.isPublished
                              ? "  text-green-700 bg-green-200"
                              : "text-red-700 bg-red-200"
                          } border-neutral-300 rounded-xl flex items-center justify-center p-2 `}
                          variant={
                            course.is_published ? "secondary" : "default"
                          }
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
