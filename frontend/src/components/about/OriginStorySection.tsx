import { motion } from "framer-motion";
import { ORIGIN_STORY } from "./constants";

export function OriginStorySection() {
  return (
    <motion.section
      className="mt-24 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {ORIGIN_STORY.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          {ORIGIN_STORY.description}
        </p>
      </div>

      <div className="space-y-8">
        {ORIGIN_STORY.content.map((item, index) => (
          <motion.div
            key={item.title}
            className="flex gap-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
