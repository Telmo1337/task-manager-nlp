import { motion } from "framer-motion";
import { HOW_IT_WORKS, STEPS } from "./constants";

export function HowItWorksSection() {
  return (
    <motion.section
      id="how-it-works"
      className="mt-32 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {HOW_IT_WORKS.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          {HOW_IT_WORKS.description}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            className="relative p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mt-4 mb-3">
              {step.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
