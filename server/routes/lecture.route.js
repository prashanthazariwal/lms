import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createLecture, deleteLecture, editLecture, getLectures, uploadLectureVideo } from "../controllers/courseController.js";

const router = Router();
router.post("/create-lecture/:courseId", authenticate, uploadLectureVideo, createLecture);
router.patch(
  "/edit-lecture/:lectureId",
  authenticate,
  uploadLectureVideo,
  editLecture
);
router.delete("/remove-lecture/:lectureId", authenticate, deleteLecture);
router.get("/course-lectures/:courseId", authenticate, getLectures);

export default router;