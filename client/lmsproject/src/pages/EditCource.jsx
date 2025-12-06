import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCourse, editCourse, getCourseDetails, getCreatorCourses } from "../store/slices/courseSlice";
import { useDispatch } from "react-redux";

const EditCource = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseDetails, loading } = useAppSelector((state) => state.courses);
  const [published, setPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [level, setLevel] = useState("");

  useEffect(() => {
    // Fetch course details using courseId
    dispatch(getCourseDetails(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
  if (courseDetails) {
    setTitle(courseDetails.title || "");
    setdescription(courseDetails.description || "");
    setCategory(courseDetails.category || "");
    setPrice(courseDetails.price || "");
    setLevel(courseDetails.level || "");
    setPublished(Boolean(courseDetails.isPublished));
  }
}, [courseDetails]);
  useEffect(() => {
    if (courseDetails) {
      setPublished(courseDetails.isPublished);
    }
  }, [courseDetails]);
  if (loading || !courseDetails) {
    return <p className="text-center mt-10">Loading course...</p>;
  }
  const handlePublish = () => {
    setPublished(!published);
  };
  const handelDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
       await dispatch(deleteCourse(courseId));
        navigate("/instructor/dashboard");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }}
  const handelSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("isPublished", published); // 🔥 IMPORTANT
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const result = await dispatch(editCourse({ courseId, updatedData : formData }));

    if (editCourse.fulfilled.match(result)) {
      alert("Course Updated Successfully!"); 

      // 🔥 Re-fetch the course list
      dispatch(getCreatorCourses());

      // 🔥 Go back to dashboard
      navigate("/instructor/dashboard");
    } else {
      alert("Failed to update course!");
    }
  };
  return (
    <div className="max-w-7xl mx-auto pt-10 ">
      <div className="w-full flex justify-between items-center px-4">
        <h2>Add detail information regarding course</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/instructor/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
      <div className="w-full p-6 rounded-lg bg-[#FAF9F6] mt-6">
        <form action="" onSubmit={handelSubmit}>
          <h4>Basic course information</h4>
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={handlePublish}
              className={`px-4 border ${
                published
                  ? "text-green-700 bg-green-200"
                  : "text-red-700 bg-red-200"
              } border-neutral-300 rounded-xl hover:bg-neutral-100 flex items-center justify-center p-2 `}
            >
              {published ? "published" : "click to Publish"}
            </button>
            <button
              onClick={()=>handelDelete(courseDetails._id)}
              type="button"
              className="flex items-center justify-center p-2 px-4 border rounded-xl bg-red-600 text-white"
            >
              Remove cource
            </button>
          </div>
          <div className="w-full mx-auto mt-10 p-6 rounded shadow space-y-6">
            <div>
              <label className="block mb-1 font-medium">Course Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Course Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                rows={5}
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <input
                value={category}
                type="text"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Thumbnail Image</label>
              <input
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                accept="image/jpeg,image/png,image/webp"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price (INR)</label>
              <input
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Course Level</label>
              <select
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" className="px-6 ">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCource;
