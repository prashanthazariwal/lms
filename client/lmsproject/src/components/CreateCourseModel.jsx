import React from "react";
import { createPortal } from "react-dom";
import { createCourse, getCreatorCourses } from "../store/slices/courseSlice";
import { useDispatch } from "react-redux";

const CreateCourseModel = ({ isModelOpen, setIsModelOpen }) => {
  const dispatch = useDispatch();
  const [courseTitle, setCourseTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      title: courseTitle,
      category,
      description,
    };
    try {
      console.log(courseData);
      const res = await dispatch(createCourse(courseData)); // WAIT FOR API
      console.log("Course created:", res);
      await dispatch(getCreatorCourses());

      setIsModelOpen(false); // CLOSE ONLY AFTER SUCCESS
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-3xl flex items-center justify-center z-50 font-Montserrat ">
      {isModelOpen && (
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md mx-auto">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold ">Create New Course</h2>
            <button
              onClick={() => setIsModelOpen(!isModelOpen)}
              type="button"
              className="rounded-md cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x-icon lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-normal mb-8">
            Add a new course to your teaching portfolio
          </p>
          {/* Form fields for course creation */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Course Title
              </label>
              <input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                id="category"
                className="w-full border px-3 py-2 rounded"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="web Development">web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="mobile Development">mobile Development</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
            <div className="">
              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-600 text-white rounded-md cursor-pointer"
              >
                Create course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>,
    document.getElementById("portal")
  );
};

export default CreateCourseModel;
