import React from "react";
import Button from "../components/Button";

const ExploreCources = () => {
  const featuers = [
    {
      title: "Audio className",
      icon: (
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
          className="lucide lucide-volume2-icon lucide-volume-2"
        >
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
        </svg>
      ),
    },
    {
      title: "Live className",
      icon: (
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
          className="lucide lucide-radio-icon lucide-radio"
        >
          <path d="M16.247 7.761a6 6 0 0 1 0 8.478" />
          <path d="M19.075 4.933a10 10 0 0 1 0 14.134" />
          <path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
          <path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      title: "Recorded className",
      icon: (
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
          className="lucide lucide-video-icon lucide-video"
        >
          <path d="M15 10l4.553-2.276A2 2 0 0 1 22 9.618v4.764a2 2 0 0 1-2.447 1.894L15 14M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        </svg>
      ),
    },
    {
      title: "Expert Teacher",
      icon: (
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
          className="lucide lucide-user-check-icon lucide-user-check"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="m17 11 2 2 4-4" />
        </svg>
      ),
    },
  ];
  return (
    <div className="w-full flex justify-between items-end p-4">
      <div className="left w-1/3 h-[50dvh] relative bg-blue-400/30 backdrop-blur-md rounded-b-full overflow-hidden flex items-center justify-center">
        <span className="inline-block w-[120%] h-full absolute bottom-full rotate-12  origin-bottom-left bg-[#FAF9F6]">
          {" "}
        </span>
        <img
          src="/images/girl.png"
          alt="girl"
          className=" object-cover h-[50dvh] absolute left-1 top-0"
        />
      </div>
      <div className="right w-fit  h-[60dvh] capitalize px-8 flex flex-col justify-center ">
        <div>
          <h2 className="text-4xl font-bold">
            We Help to learning skills <br /> for better career
          </h2>
          <p className="text-md font-bold text-neutral-500 mt-3">
            a learning platform based on pratical knowledge with best <br />{" "}
            mentors we help you find a perfect tutor
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-5 mt-8">
          {featuers.map((_, index) => {
            return (
              <div key={index}>
                <div className="flex items-center gap-2 mt-4">
                  <div className="icon w-8 h-8 flex items-center justify-center rounded-md">
                    {_?.icon}
                  </div>
                  <h3 className="font-semibold">{_?.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <Button children={"Exploure Cources"} variant="outline" className="mt-8" />
      </div>
    </div>
  );
};

export default ExploreCources;
