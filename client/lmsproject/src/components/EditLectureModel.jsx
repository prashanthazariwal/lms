import React from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { editLectureThunk, getLecturesByCourseThunk } from "../store/slices/lectureSlice";

const EditLectureModel = ({ lecture, onclose, id }) => {
  const [preview, setPreview] = React.useState(lecture.isPreviewFee);
  const [lectureTitle, setLectureTitle] = React.useState(lecture.title);
  const [video, setVideo] = React.useState(null);
  const dispatch = useDispatch();

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", lectureTitle);
    formData.append("video", video);
    formData.append("isPreviewFee", preview); // 🔥 backend uses isPreviewFee

    dispatch(
      editLectureThunk({ lectureId: lecture._id, updatedData: formData })
    )
      .unwrap()
      .then(() => {
        alert("Lecture updated successfully!");
        dispatch(getLecturesByCourseThunk(id));
        onclose();
      })
      .catch((error) => {
        console.error("Failed to update lecture:", error);
        alert("Failed to update lecture. Please try again.");
      });
  };
  return createPortal(
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-3xl flex items-center justify-center z-50 font-Montserrat ">
      {lecture && (
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md mx-auto">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold ">Edit Lecture Details</h2>
            <button
              onClick={() => onclose()}
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
            update the lecture information below
          </p>
          {/* Form fields for course creation */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Lecture Title
              </label>
              <input
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="video text-sm block mb-2 font-medium text-gray-900">
                <input
                  type="file"
                  name="video"
                  onChange={(e) => setVideo(e.target.files[0])}
                  accept="video/*"
                  id="video"
                  className="w-full border border-neutral-200 px-3 py-2 rounded file:border file:border-neutral-200 file:px-4 file:py-1 file:font-normal file:text-neutral-600 file:mr-4 file:rounded-md file:shadow-2xs file:capitalize text-neutral-600 text-md"
                />
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handlePreview}
                className={`px-4 border ${
                  preview
                    ? "text-green-700 bg-green-200"
                    : "text-red-700 bg-red-200"
                } border-neutral-300 rounded-xl hover:bg-neutral-100 flex items-center justify-center p-2 `}
              >
                {preview ? "free preview" : "Paid preview"}
              </button>
            </div>
            <div className="">
              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-600 text-white rounded-md cursor-pointer"
              >
                update Lecture
              </button>
            </div>
          </form>
        </div>
      )}
    </div>,
    document.getElementById("portal")
  );
};

export default EditLectureModel;
