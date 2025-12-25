import cloudinary from "../config/cloudinary.js";
import {  uploadImage, uploadVideo } from "../config/multerConfig.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import safeUnlink from "../utils/safeUnlick.js";

export const uploadCourseThumbnail = uploadImage.single("thumbnail");
export const uploadLectureVideo = uploadVideo.single("video");
// Courses Controllers
export const createCourse = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      throw new ApiError("All fields are required", 400);
    }
    const newCourse = await Course.create({
      title,
      category,
      description,
      creator: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse("Course created successfully", 201, newCourse));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
export const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });
    if (!courses) {
      throw new ApiError("No published courses found", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse("Published courses fetched successfully", 200, courses)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
export const getCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user._id });
    if (!courses) {
      throw new ApiError("No courses found for this creator", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse("Creator courses fetched successfully", 200, courses)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      category,
      description,
      level,
      price,
      subTitle,
      isPublished,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    let thumbnailUrl = "";
    let thumbnailPublicId = "";

    // Upload new thumbnail only if user sends a file
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "nocap_courses",
      });

      thumbnailUrl = uploadResult.secure_url;
      thumbnailPublicId = uploadResult.public_id;

      // Delete old cloudinary image (only if new uploaded)
      if (course.thumbnailPublicId) {
        await cloudinary.uploader.destroy(course.thumbnailPublicId);
      }
    }

    // Update fields
    course.title = title || course.title;
    course.category = category || course.category;
    course.description = description || course.description;
    course.level = level || course.level;
    course.price = price || course.price;
    course.subTitle = subTitle || course.subTitle;
    course.isPublished =
      isPublished !== undefined ? isPublished : course.isPublished;

    // Update thumbnail only if new uploaded
    if (thumbnailUrl) {
      course.thumbnail = thumbnailUrl;
      course.thumbnailPublicId = thumbnailPublicId;
    }

    // Safe unlink only if file exists
    if (req.file) {
      await safeUnlink(req.file.path);
    }

    await course.save();

    return res
      .status(200)
      .json(new ApiResponse("Course updated successfully", 200, course));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate([
      {
        path: "lectures",
        select: "title videoUrl isPreviewFee"
      },
      {
        path: "creator",
        select: "-password -__v -createdAt -updatedAt -refreshToken -resetOtp -otpExpires -isOtpVerified ",
      }
    ]);

    if (!course) {
      throw new ApiError("Course not found", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse("Course details fetched successfully", 200, course)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    // 🟢 1. Delete course thumbnail from Cloudinary
    if (course.thumbnailPublicId) {
      await cloudinary.uploader.destroy(course.thumbnailPublicId);
    }

    // 🟢 2. Delete all lecture videos from Cloudinary
    for (const lecture of course.lectures) {
      if (lecture.videoUrlPublicId) {
        await cloudinary.uploader.destroy(lecture.videoUrlPublicId, {
          resource_type: "video",
        });
      }
    }

    // 🟢 3. Delete lectures from DB
    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    // 🟢 4. Delete course from DB
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json(
      new ApiResponse("Course deleted successfully", 200, null)
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json(
      new ApiResponse(error.message, error.statusCode, null)
    );
  }
};


// Lectures Controllers
export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, isPreviewFree } = req.body;

    if (!req.file) {
      throw new ApiError("Lecture video is required", 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    // ✅ Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "nocap_lectures",
      resource_type: "video", // 🔥 IMPORTANT
    });

    const newLecture = await Lecture.create({
      title,
      videoUrl: uploadResult.secure_url,
      videoUrlPublicId: uploadResult.public_id,
      isPreviewFree,
    });

    course.lectures.push(newLecture._id);
    await course.save();

    // ✅ Remove local file
    await safeUnlink(req.file.path);

    return res
      .status(201)
      .json(new ApiResponse("Lecture created successfully", 201, newLecture));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};

export const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      throw new ApiError("Course not found", 404);
    }
    return res
      .status(200)
      .json(
        new ApiResponse("Lectures fetched successfully", 200, course.lectures)
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError("Course not found", 404);

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) throw new ApiError("Lecture not found", 404);

    // 🔥 Delete video from Cloudinary
    if (lecture.videoPublicId) {
      await cloudinary.uploader.destroy(lecture.videoUrlPublicId, {
        resource_type: "video",
      });
    }

    // 🔥 Remove lecture from course
    course.lectures = course.lectures.filter(
      (id) => id.toString() !== lectureId
    );
    await course.save();

    // 🔥 Delete lecture document
    await lecture.deleteOne();

    return res.status(200).json(
      new ApiResponse("Lecture deleted successfully", 200, null)
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
export const editLecture = async (req, res) => {
  try {
    const {  lectureId } = req.params;
    const { title, isPreviewFee } = req.body;

    const course = await Course.findOne({ lectures: lectureId });
    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      throw new ApiError("Lecture not found", 404);
    }

    let videoUrl = lecture.videoUrl;
    let videoPublicId = lecture.videoUrlPublicId;

    // 🔥 Upload new video only if sent
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video", // 👈 VERY IMPORTANT
        folder: "nocap_lectures",
      });

      videoUrl = uploadResult.secure_url;
      videoPublicId = uploadResult.public_id;

      // 🔥 Delete old video from Cloudinary
      if (lecture.videoUrlPublicId) {
        await cloudinary.uploader.destroy(lecture.videoUrlPublicId, {
          resource_type: "video",
        });
      }

      // Cleanup local file
      await safeUnlink(req.file.path);
    }

    // Update fields
    lecture.title = title || lecture.title;
    lecture.videoUrl = videoUrl;
    lecture.videoUrlPublicId = videoPublicId;
    lecture.isPreviewFee =
      isPreviewFee !== undefined ? isPreviewFee : lecture.isPreviewFee;

    await lecture.save();

    return res
      .status(200)
      .json(new ApiResponse("Lecture updated successfully", 200, lecture));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};
