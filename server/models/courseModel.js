import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginer", "Intermediate", "Advance"],
      default: "Beginer",
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    thumbnailPublicId: {
      type: String,
      default: null,
    },
    enrolledStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    lectures: [{
      type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
    }],
    creator: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublished: {
      type: Boolean,
        default: false,
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
