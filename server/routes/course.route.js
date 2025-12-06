import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllPublishedCourses,
  getCourseDetails,
  getCreatorCourses,
  uploadCourseThumbnail,
} from "../controllers/courseController.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-course", authenticate, createCourse);
router.get("/published", getAllPublishedCourses);
router.get("/creator-courses", authenticate, getCreatorCourses);
router.patch(
  "/editcourse/:courseId",
  authenticate,
  uploadCourseThumbnail,
  editCourse
);
router.get("/:courseId", authenticate, getCourseDetails);
router.delete("/remove/:courseId", authenticate, deleteCourse);

export default router;
