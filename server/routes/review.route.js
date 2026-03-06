import express from "express";
import { createReview, getAllReviews } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create-review/:courseId", authenticate, createReview);
router.post("/get-reviews" , authenticate, getAllReviews);

export default router;