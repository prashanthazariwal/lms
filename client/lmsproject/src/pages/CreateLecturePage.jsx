import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseDetails } from "../store/slices/courseSlice";
import { useParams } from "react-router-dom";
import {
  createLectureThunk,
  getLecturesByCourseThunk,
} from "../store/slices/lectureSlice";
import { Edit } from "lucide-react";
import EditLectureModel from "../components/EditLectureModel";


const CreateLecturePage = () => {
  const { courseId } = useParams();
  const [Preview, setPreview] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCourseDetails(courseId));
  }, [dispatch]);
  const course = useSelector((state) => state?.courses?.courseDetails);
  const lectures = useSelector((state) => state?.lectures?.lectures?.data);

  const handlePreview = () => {
    setPreview(!Preview);
  };

  // form submit handler will be added later
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !video) {
      alert("Title and video are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
    formData.append("isPreviewFee", Preview); // 🔥 backend uses isPreviewFee

    try {
      await dispatch(
        createLectureThunk({ courseId, lectureData: formData })
      ).unwrap();

      // ✅ Success feedback
      alert("Lecture created successfully!");

      // ✅ Reset form
      setTitle("");
      setVideo(null);
      setPreview(false);

      // ✅ Reset file input manually
      document.getElementById("video").value = "";

      // ✅ Refresh course details (so lectures update)
      dispatch(getCourseDetails(courseId));
    } catch (error) {
      console.error(error);
      alert(error || "Failed to create lecture");
    }
  };

  useEffect(() => {
    dispatch(getLecturesByCourseThunk(courseId));
  }, [courseId, dispatch]);

  return (
    <>
      <div className="max-w-7xl p-4 mx-auto ">
        <form
          onSubmit={handleSubmit}
          className="mt-4 w-full flex flex-col gap-4 ring ring-neutral-200 p-6 rounded-lg "
        >
          <h2 className="text-xl font-semibold capitalize">
            {`create Lectures for ${course?.title} course`}{" "}
          </h2>
          <div className="flex justify-between items-end  mb-5">
            <h4 className="text-md font-semibold text-neutral-700 capitalize">
              fill the Basic lecture information
            </h4>
            <button
              type="button"
              onClick={handlePreview}
              className={`px-4 border ${
                Preview
                  ? "text-green-700 bg-green-200"
                  : "text-red-700 bg-red-200"
              } border-neutral-300 rounded-xl hover:bg-neutral-100 flex items-center justify-center p-2 `}
            >
              {Preview ? "free preview" : "Paid preview"}
            </button>
          </div>
          <label htmlFor="title text-sm block mb-2  text-neutral-700 font-medium">
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lecture Title"
              className="w-full border border-neutral-200 px-3 py-2 rounded focus:border-neutral-500 focus:outline-none text-md"
            />
          </label>
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
          <button
            type="submit"
            className="mt-4 w-fit bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Lecture
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Lecture Preview</h3>
          <div className="space-y-4">
            {lectures && lectures.length === 0 && (
              <p className="text-neutral-600">No lectures added yet.</p>
            )}
            {lectures &&
              lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="p-4 border flex items-center justify-between border-neutral-200 rounded-lg"
                >
                  <h4 className="font-medium">{lecture.title}</h4>
                  <div className="flex items-center gap-4">
                    <p className={`text-sm font-semibold ${lecture.isPreviewFee ? "text-green-700" : "text-red-700"}`}>
                       {lecture.isPreviewFee ? "Free Preview" : "Paid Only"}
                    </p>
                    <button
                      variant="outline"
                      className="flex-1 border border-neutral-300 rounded-xl hover:bg-neutral-100 flex items-center justify-center p-2"
                      onClick={() => setEditingLecture(lecture)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                  </div>
                  {editingLecture && (
                    <EditLectureModel
                      lecture={editingLecture}
                      onclose={() => setEditingLecture(null)}
                      id={courseId}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLecturePage;
