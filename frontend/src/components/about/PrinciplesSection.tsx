import { motion } from "framer-motion";
import { PRINCIPLES } from "./constants";

export function PrinciplesSection() {
  return (
    <motion.section
      className="mt-24 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
        Our Principles
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
        The core values that guide every decision we make
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {PRINCIPLES.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <motion.div
              key={principle.title}
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {principle.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {principle.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
