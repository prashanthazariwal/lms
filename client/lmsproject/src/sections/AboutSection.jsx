import React from "react";
import Button from "../components/Button";

const AboutSection = () => {
  const featuers = [
    {
      title: "Simplified Learning",
    },
    {
      title: "Expert Trainers",
    },
    {
      title: "Big Experience",
    },
    {
      title: "Life Time Access",
    },
  ];
  return (
    <div className="w-full mt-24">
      <div className="w-full flex justify-between items-end p-4 ">
        <div className="left w-1/3 h-[50dvh] relative bg-blue-400/30 backdrop-blur-3xl rounded-b-full overflow-hidden flex items-center justify-center -top-8">
          <span className="inline-block w-[120%] h-full absolute bottom-full rotate-12  origin-bottom-left bg-[#FAF9F6]">
            {" "}
          </span>
          <img
            src="/images/girl2.png"
            alt="girl"
            className=" object-cover h-[50dvh] absolute left-10 top-0"
          />
        </div>
        <div className="right w-[55%] h-[60dvh] capitalize px-8 flex flex-col justify-center ">
          <div>
            <h2 className="text-4xl font-bold">
              The Learning Platform offers, <br /> What and Who we are
            </h2>
            <p className="text-sm font-semibold text-justify w-[90%] leading-5 tracking-tight text-neutral-500 mt-3">
              NOCAP is a skill-first learning platform designed to help
              individuals build real, industry-relevant skills. We focus on
              practical learning, real-world projects, and mentorship-driven
              guidance — cutting through noise, hype, and limitations.
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-2  mt-8">
            {featuers.map((_, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="icon w-8 h-8 flex items-center justify-center rounded-md">
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
                        className="lucide lucide-badge-check-icon lucide-badge-check"
                      >
                        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">{_?.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
