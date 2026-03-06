import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCourseDetails } from "../store/slices/courseSlice";
import { getCurrentUser } from "../store/slices/authSlice";

const ViewCourseLectures = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [activeLecture, setActiveLecture] = useState(null);

  useEffect(() => {
    dispatch(getCourseDetails(courseId));
    // dispatch(getCurrentUser());
  }, [courseId, dispatch]);

  // const userData = useSelector((state) => state?.auth?.user);
  const course = useSelector((state) => state?.courses?.courseDetails);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col mt-10">
        <div className="w-full p-4 my-4 bg-neutral-200 flex justify-between items-center rounded-lg">
          <h1>{course?.title}</h1>
          <div className="flex gap-5">
            <span>{course?.category}</span>
            <span>{course?.level}</span>
          </div>
        </div>
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
                  className={`mb-2 list-none p-4 rounded-lg bg-neutral-100 border border-neutral-200  text-md text-neutral-800 font-normal cursor-pointer hover:bg-neutral-200 flex items-center gap-4`}
                >
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
                    className="lucide lucide-circle-play-icon lucide-circle-play size-6"
                  >
                    <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>

                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-4/6 ml-4 border rounded-md border-neutral-300 p-4">
            {activeLecture ? (
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
            <h2 className="text-xl font-bold my-4">{activeLecture?.title}</h2>
            <p className="text-sm font-bold uppercase text-blue-500">
              {course?.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseLectures;
