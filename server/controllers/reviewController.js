import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    console.log(courseId)
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError("Course not found", 404);
    }
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      course: courseId,
    });
    if (alreadyReviewed) {
      throw new ApiError("You have already reviewed this course", 400);
    }

    const review = new Review({
      user: req.user._id,
      rating,
      comment,
      course: courseId,
    });
    await review.save();
    course.reviews.push(review._id);
    await course.save();
    return res
      .status(201)
      .json(new ApiResponse("Review created successfully", 201, review));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.message, error.statusCode, null));
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const reviews = await Review.find({})
      .populate("user", "name", "profilePicture", "role")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse("Reviews fetched successfully", 200, reviews));
  } catch (error) {
    return res.status(error.statusCode || 500);
  }
};
