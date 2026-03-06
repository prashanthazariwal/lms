import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseDetails } from "../store/slices/courseSlice";
import { BookOpen, Star } from "lucide-react";
import Button from "../components/Button";
import {
  createOrderThunk,
  verifyPaymentThunk,
} from "../store/slices/orderSlice";
import { getCurrentUser } from "../store/slices/authSlice";
import { useMemo } from "react";
import { createReviewThunk } from "../store/slices/reviewSlice";

const ViewCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [activeLecture, setActiveLecture] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state?.auth?.user);
  const course = useSelector((state) => state?.courses?.courseDetails);

  // console.log(course);
  // console.log(userData);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getCourseDetails(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    if (course?.lectures?.length && !activeLecture) {
      setActiveLecture(course.lectures[0]);
    }
  }, [course]);

  const handelEnroll = async (courseId) => {
    try {
      if (!userData) {
        navigate("/login", {
          state: { from: `/view-course/${courseId}` },
        });
        return;
      }
      const { payload } = await dispatch(
        createOrderThunk({ courseId: courseId }),
      );
      console.log(payload);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: payload.order.amount,
        currency: payload.order.currency,
        name: "LMS NoCap Academy",
        description: "Test Transaction",
        order_id: payload.order.id,
        handler: async function (response) {
          console.log("razorpay response", response);
          try {
            await dispatch(
              verifyPaymentThunk({
                courseId,
                userId: userData._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            );
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Failed to verify payment. Please try again.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };
  const handelSubmitReview = async () => {
    setLoading(true);
    try {
      const reviewData = {
        rating: stars,
        comment: review,
      };
      await dispatch(createReviewThunk({ courseId, reviewData }));
      alert("Review created successfully!");
      setReview("");
      setStars(0);
      dispatch(getCourseDetails(courseId));
    } catch (error) {
      console.error("Error creating review:", error);
      alert("Failed to create review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = useMemo(() => {
    if (!userData?.enrolledCourses?.length) return false;

    return userData.enrolledCourses.some((course) => {
      // handles ObjectId string OR populated object
      return typeof course === "string"
        ? course === courseId
        : course?._id === courseId;
    });
  }, [userData, courseId]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full flex px-4 rounded-lg my-6">
        <div className="flex items-center justify-center w-2/5 h-[40dvh] rounded-md overflow-hidden  border border-neutral-600">
          {course?.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col  ml-6 font-StackSansHeadline ">
          <h1 className="text-3xl font-bold mb-2 uppercase">{course?.title}</h1>
          <p className="text-gray-500 mb-4 text-md font-normal">
            {course?.description}
          </p>
          <ul>
            <li className="text-md mt-2">
              <strong>Category : </strong> {course?.category}
            </li>
            <li className="text-md mt-2">
              <strong>Level : </strong> {course?.level}
            </li>
            <li className="text-md mt-2">
              ⭐ {course?.reviews?.length} reviews
            </li>
          </ul>
          <h2 className="text-lg mt-2">
            &#8377; {course?.price}{" "}
            {course?.price && (
              <span className="line-through text-gray-500 text-sm">
                {Number(course.price) * 2 + 1}
              </span>
            )}
          </h2>

          {isEnrolled ? (
            <Button
              onClick={() => navigate(`/view-course-lectures/${course._id}`)}
              className="mt-4 w-fit rounded-xs bg-green-500 hover:bg-green-600 text-white"
              variant="success"
            >
              Watch now
            </Button>
          ) : (
            <Button
              className="mt-4 w-fit rounded-xs "
              onClick={() => handelEnroll(course._id)}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
      <ul className=" list-inside text-md font-mono mb-6 px-4 text-neutral-500">
        {course?.requirements ? (
          <li>{course?.requirements}</li>
        ) : (
          <li>
            Basic understanding of programing language No specific requirements.
          </li>
        )}
        <li>
          Beginners , aspiring developers , and professionals looking to upgrade
          skills{" "}
        </li>
      </ul>

      <div className="flex">
        <div className="w-2/6 flex flex-col border rounded-md border-neutral-300 p-4">
          <h2 className="text-2xl font-bold mb-4 font-StackSansHeadline text-neutral-800">
            Course Content
          </h2>
          <ul className="list-disc list-inside">
            {course?.lectures.map((item, index) => (
              <li
                key={index}
                onClick={() => setActiveLecture(item)}
                className={`mb-2 list-none p-4 rounded-lg bg-neutral-100 border border-neutral-200  text-md text-neutral-800 font-normal cursor-pointer hover:bg-neutral-200 flex items-center gap-4 ${
                  item.isPreviewFee
                    ? "hover:border-green-500"
                    : "hover:border-red-500"
                }`}
              >
                {item.isPreviewFee ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-play-icon lucide-circle-play size-4"
                  >
                    <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-lock-icon lucide-lock size-4"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}{" "}
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-4/6 ml-4 border rounded-md border-neutral-300 p-4">
          {activeLecture && activeLecture.isPreviewFee ? (
            <video
              src={activeLecture.videoUrl}
              controls
              className="w-full h-[40dvh] rounded-md object-cover"
            />
          ) : (
            <p className="text-neutral-500 text-center my-16 ">
              preview is not free for this lecture
            </p>
          )}
          <h2 className="text-xl font-bold mt-4">{activeLecture?.title}</h2>
          <p className="text-md font-normal uppercase text-neutral-500">
            {course?.title}
          </p>
        </div>
      </div>

      <hr className="my-8" />
      <div className="flex my-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <Star
            strokeWidth={1}
            key={item}
            className={item <= stars ? "fill-amber-300" : "fill-neutral-100"}
            onClick={() => setStars(item)}
          />
        ))}
      </div>

      <textarea
        className="w-full p-4  border border-neutral-200 px-3 py-2 rounded focus:border-neutral-500 focus:outline-none text-md"
        name="review"
        id="review"
        value={review}
        onChange={(e) => {
          setReview(e.target.value);
        }}
        rows={4}
        placeholder="write your review here...."
      ></textarea>
      <Button
        onClick={handelSubmitReview}
        className="mt-4 mb-8"
        variant="outline"
      >
        Submit Review
      </Button>
      <hr className="my-8" />
    </div>
  );
};

export default ViewCoursePage;
