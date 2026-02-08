import { motion } from "framer-motion";
import { TIMELINE } from "./constants";

export function TimelineSection() {
  return (
    <motion.section
      className="mt-24 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
        Our Journey
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700 md:-translate-x-0.5" />

        <div className="space-y-8">
          {TIMELINE.map((event, index) => (
            <motion.div
              key={event.date}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-blue-600 rounded-full -translate-x-1.5 md:-translate-x-1.5 mt-2" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {event.date}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-1 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
