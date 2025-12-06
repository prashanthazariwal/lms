import { motion } from "motion/react"

export default function HeroSection() {
  return (
    <section className="min-h-[80vh]  flex  justify-center px-6">
      <div className="max-w-4xl text-center flex flex-col items-center h-fit mt-32">
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-700 text-xs tracking-wide relative font-Montserrat border rounded-full px-4 py-2 inline-block mb-4"
        >
         <span className="h-2 w-2 bg-blue-500 animate-ping absolute rounded-full top-0 left-0"></span> Learn. Build. Transform.
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-5xl md:text-6xl font-StackSansHeadline font-bold mt-4 leading-tight text-neutral-800"
        >
          Master Design & 
          <span className="text-blue-600">  Development  </span>
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-neutral-600 font-medium text-md w-3xl mt-6 font-Montserrat"
        >
          Beginner-friendly learning for students who want to master 
          <span className="font-semibold text-neutral-800"> Web Development </span> 
          and 
          <span className="font-semibold text-neutral-800"> Graphic Design</span>.
          Zero experience needed. Real projects included.
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
              duration : 0.2,
              ease : "easeInOut"
            }}
            className="bg-blue-600 text-white cursor-pointer px-6 py-3 rounded-md text-md font-medium shadow-md hover:shadow-lg transition-all"
          >
            Start Learning
          </motion.button>

          <motion.buttons
            whileTap={{ scale: 0.98 }}
            transition={{
              duration : 0.2,
              ease : "easeInOut"
            }}
            className=" text-blue-600 hover:text-white px-6 py-3 cursor-pointer rounded-full text-md font-medium hover:bg-blue-600 transition-all duration-100 font-StackSansHeadline border border-blue-600 hover:border-transparent border-dotted"
          >
            Explore Courses
          </motion.buttons>
        </motion.div>

      </div>
    </section>
  );
}
