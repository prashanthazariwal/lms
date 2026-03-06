import razorpay from "razorpay";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import crypto from "crypto";

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    const options = {
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_order_${courseId}`,
    };
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      userId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // 🔐 Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 📦 Fetch order from Razorpay
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 👤 Fetch user
    const user = await User.findById(userId);

    // ✅ Ensure payments array exists
    if (!user.payments) {
      user.payments = [];
    }

    // 🚫 Prevent duplicate payment
    if (user.payments.includes(razorpay_payment_id)) {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    // 💾 Save payment
    user.payments.push(razorpay_payment_id);

    // 🎓 Enroll user
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
    }

    await user.save();

    // 📚 Update course
    const course = await Course.findById(courseId);
    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & course enrolled successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

