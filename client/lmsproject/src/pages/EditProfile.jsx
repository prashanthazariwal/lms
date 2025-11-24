import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, setUploadProgress, clearProfileError } from "../store/slices/profileSlice";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const dispatch = useDispatch();
  const { user, loading, error, uploadProgress } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  // Local state for form fields
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    bio: user?.bio || "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePictureUrl || "");
  const fileInputRef = useRef();

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearProfileError());
    // Build FormData
    const fd = new FormData();
    fd.append("userName", formData.userName);
    fd.append("bio", formData.bio);
    if (file) fd.append("profilePicture", file);
    // Dispatch thunk with progress callback
    await dispatch(updateProfile(fd));
    navigate("/")
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border px-3 py-2 rounded"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">Uploading... {uploadProgress}%</span>
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
