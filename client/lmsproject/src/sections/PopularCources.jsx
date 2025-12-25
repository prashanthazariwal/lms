import React, { use, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { fetchPublishedCourses } from "../store/slices/courseSlice";
import Button from "../components/Button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PopularCources = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cources = useAppSelector((state) => state?.courses?.courses || []);
  useEffect(() => {
    dispatch(fetchPublishedCourses());
  }, [dispatch]);

  return (
    <div className="w-full flex flex-col justify-between items-end p-4 mt-20">
      <div className="flex flex-col text-center">
        <h2 className="text-4xl font-bold capitalize">
          explore our popular courses
        </h2>
        <p className="text-sm font-semibold text-neutral-500 mt-3 w-[74%] mx-auto leading-5 ">
          Explore a variety of popular courses designed to enhance your skills
          and knowledge across different domains. Whether you're looking to
          advance your career or pursue a new hobby, our curated selection of
          courses offers something for everyone.
        </p>
      </div>

      <div className="right w-full capitalize px-8 flex flex-col justify-center mt-4 ">
        <div className="w-full flex justify-center flex-wrap gap-5 mt-8 ">
          {cources.slice(0, 4).map((course, index) => {
            return (
              <div
                key={course._id}
                onClick={() => {}}
                className=" hover:shadow-2xs hover:shadow-cyan-500 transition-all w-[20vw] bg-white rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <h2 className="font-display text-lg font-semibold text-neutral-800">
                    {course.title}
                  </h2>
                  <p className="text-sm font-semibold text-neutral-600">
                    {course.category}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500 font-semibold mb-8 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="  border-neutral-300 rounded-xl text-green-600  inline-block">
                      {course.level}
                    </span>
                    <Button
                      children={"Exploure Cource"}
                      variant="outline"
                      className=""
                      onClick={() => navigate(`/view-course/${course._id}`)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCources;
