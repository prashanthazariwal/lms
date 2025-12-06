import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multerConfig.js";
import Course from "../models/courseModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import safeUnlink from "../utils/safeUnlick.js";

export const uploadCourseThumbnail = upload.single('thumbnail');
export const createCourse = async (req, res) => {
    try {
        const { title, category , description} = req.body;
        if (!title || !category || !description) {
            throw new ApiError("All fields are required", 400);
        }
        const newCourse = await Course.create({
            title,
            category,
            description,
            creator : req.user._id,
        });
         return res
      .status(201)
      .json(new ApiResponse( "Course created successfully", 201 , newCourse));

    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
}
export const getAllPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished : true});
        if (!courses) {
            throw new ApiError("No published courses found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse("Published courses fetched successfully", 200, courses));
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const courses = await Course.find({creator : req.user._id});
        if(!courses){
            throw new ApiError("No courses found for this creator", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse("Creator courses fetched successfully", 200, courses));
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }   
}

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, category, description, level, price, subTitle, isPublished } = req.body;

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
    course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

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

    return res.status(200).json(
      new ApiResponse("Course updated successfully", 200, course)
    );

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};


export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
        
        if (!course) {
            throw new ApiError("Course not found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse("Course details fetched successfully", 200, course));
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
}
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByIdAndDelete(courseId , { new: true });
        if (!course) {
            throw new ApiError("Course not found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse("Course deleted successfully", 200, null));
    }
        catch (error) {
        return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.message, error.statusCode, null));
    }
}