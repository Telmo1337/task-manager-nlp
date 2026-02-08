import { motion } from "framer-motion";
import { VISION } from "./constants";

export function VisionSection() {
  return (
    <motion.section
      className="mt-24 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
        {VISION.title}
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
        {VISION.description}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {VISION.goals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.div
              key={goal.title}
              className="p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {goal.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {goal.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
