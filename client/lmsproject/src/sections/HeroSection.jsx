import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="min-h-[80vh] relative flex  justify-center px-6 bg-linear-to-b from-[oklch(97.7% 0.013 236.62)] via-blue-50 to-[oklch(97.7% 0.013 236.62)]">
      <div className="left-line w-0.5 h-full absolute top-0 left-0 bg-linear-to-b from-[oklch(97.7% 0.013 236.62)] via-blue-100 to-[oklch(97.7% 0.013 236.62)]"></div>
      <div className="right-line w-0.5 h-full absolute top-0 right-0 bg-linear-to-b from-[oklch(97.7% 0.013 236.62)] via-blue-100 to-[oklch(97.7% 0.013 236.62)]"></div>
      <div className="max-w-4xl text-center flex flex-col items-center h-fit mt-32">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-700 text-xs tracking-wide relative font-Montserrat border border-neutral-300 shadow rounded-full px-4 py-2 inline-block mb-4"
        >
          <span className="h-2 w-2 bg-blue-700 animate-ping absolute rounded-full top-0 left-0"></span>{" "}
          Learn. Build. Transform.
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-5xl md:text-6xl font-StackSansHeadline font-bold mt-4 leading-tight bg-clip-text text-transparent  [text-shadow:0_2px_3px_rgba(0,0,0,0.3)] bg-linear-to-b from-blue-100 to-blue-600"
        >
          {/* here i used bg-clip-text annd text-transparent then added a linear gradient in bg */}
          Master Design &
          <span className=" bg-clip-text bg-linear-to-b from-blue-100 to-neutral-800 ">
            {" "}
            Development{" "}
          </span>
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-neutral-700 font-normal text-md w-3xl mt-6 font-Montserrat "
        >
          Beginner-friendly learning for students who want to master
          <span className="font-semibold text-neutral-800">
            {" "}
            Web Development{" "}
          </span>
          and
          <span className="font-semibold text-neutral-800">
            {" "}
            Graphic Design
          </span>
          . Zero experience needed. Real projects included.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 justify-center mt-10"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className=" bg-radial from-blue-700 from-10% to-blue-400 text-white cursor-pointer px-6 py-3 rounded-md text-md font-medium shadow-md hover:shadow-lg transition-all text-shadow-2xs"
          >
            Start Learning
          </motion.button>

          <motion.button
            onClick={() => {
              navigate("/all-cources");
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className=" text-blue-600 hover:text-white px-6 py-3 cursor-pointer rounded-full text-md font-medium hover:bg-radial from-blue-700 from-10% to-blue-400 transition-all duration-200 ease-out font-StackSansHeadline border border-blue-600 hover:border-transparent border-dotted relative overflow-hidden"
          >
            <div className="absolute left-0 bottom-0 w-full h-[0.5px] bg-linear-to-r from-transparent via-blue-400 to-transparent"></div>
            Explore Courses
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
