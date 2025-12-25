import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedCourses } from "../store/slices/courseSlice";
import { BookOpen } from "lucide-react";
import Button from "../components/Button";

const AllCourcesPage = () => {
  const [category, setCategory] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredCources, setFilterCources] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublishedCourses());
  }, [dispatch]);

  const allPublishedCources = useSelector(
    (state) => state?.courses?.courses || []
  );

  const handelCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategory([...category, value]);
    } else {
      setCategory(category.filter((item) => item !== value));
    }
  };
  useEffect(() => {
    if (category.length === 0) {
      setFilterCources(allPublishedCources);
      setIsFilterApplied(false);
    } else {
      setIsFilterApplied(true);
      setFilterCources(
        allPublishedCources.filter((course) =>
          category.includes(course.category)
        )
      );
    }
  }, [category, allPublishedCources]);

  return (
    <div className="min-h-screen flex  font-Montserrat ">
      <aside className="w-1/5 h-screen overflow-y-auto flex flex-col p-4 border-r border-t rounded-md border-gray-300">
        <h2 className="mb-4">Filter by Category</h2>
        <form>
          <label htmlFor="web">
            <input
              type="checkbox"
              name="web Development"
              id="web"
              value={"web Development"}
              onChange={handelCategoryChange}
            />{" "}
            web Development
          </label>
          <br />
          <label htmlFor="graphic">
            <input
              type="checkbox"
              name="Graphic Design"
              id="graphic"
              value={"Graphic Design"}
              onChange={handelCategoryChange}
            />{" "}
            Graphic Design
          </label>
          <br />
          <label htmlFor="mobile">
            <input
              type="checkbox"
              name="mobile Development"
              id="mobile"
              value={"mobile Development"}
              onChange={handelCategoryChange}
            />{" "}
            mobile Development
          </label>
          <br />
          <label htmlFor="data">
            <input
              type="checkbox"
              name="Data Science"
              id="data"
              value={"Data Science"}
              onChange={handelCategoryChange}
            />{" "}
            Data Science
          </label>
        </form>
      </aside>
      <main>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFilterApplied && filteredCources.length === 0 ? (
            <div className="col-span-full text-center text-xl font-semibold text-neutral-600">
              🚀 Coming Soon
            </div>
          ) : (
            (isFilterApplied ? filteredCources : allPublishedCources).map(
              (course) => (
                <div
                  key={course._id}
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
                      />
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default AllCourcesPage;
