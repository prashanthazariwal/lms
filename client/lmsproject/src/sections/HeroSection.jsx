import { motion } from "motion/react"

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-4xl text-center">
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-700 text-lg tracking-wide"
        >
          Learn. Build. Transform.
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mt-4 leading-tight text-gray-900"
        >
          Start Your Skill Journey  
          <span className="text-indigo-600"> With Real Guidance.</span>
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-gray-600 text-lg md:text-xl mt-6"
        >
          Beginner-friendly learning for students who want to master 
          <span className="font-semibold text-gray-800"> Web Development</span> 
          and 
          <span className="font-semibold text-gray-800"> Graphic Design</span>.
          Zero experience needed. Real projects included.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="flex gap-4 justify-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition"
          >
            Start Learning
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl text-lg font-medium hover:bg-indigo-50 transition"
          >
            Explore Courses
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
