import { motion } from "framer-motion";
import { FEATURES_SECTION, FEATURES, FEATURE_COLORS } from "./constants";

export function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="mt-32 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {FEATURES_SECTION.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          {FEATURES_SECTION.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          const colors = FEATURE_COLORS[feature.color];
          return (
            <motion.div
              key={feature.title}
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
