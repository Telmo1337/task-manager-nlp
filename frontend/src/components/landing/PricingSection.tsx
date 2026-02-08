import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PRICING_SECTION, PRICING_PLANS } from "./constants";

export function PricingSection() {
  return (
    <motion.section
      id="pricing"
      className="mt-32 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {PRICING_SECTION.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">{PRICING_SECTION.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {PRICING_PLANS.map((plan) => (
          <motion.div
            key={plan.name}
            className={`p-8 rounded-2xl relative overflow-hidden ${
              plan.highlighted
                ? "bg-blue-600"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {plan.comingSoon && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                Coming Soon
              </div>
            )}
            <h3 className={`text-xl font-semibold mb-2 ${plan.highlighted ? "text-white" : "text-neutral-900 dark:text-white"}`}>
              {plan.name}
            </h3>
            <p className={`text-sm mb-4 ${plan.highlighted ? "text-blue-100" : "text-neutral-600 dark:text-neutral-400"}`}>
              {plan.description}
            </p>
            <div className={`text-4xl font-bold mb-6 ${plan.highlighted ? "text-white" : "text-neutral-900 dark:text-white"}`}>
              {plan.price}{" "}
              <span className={`text-lg font-normal ${plan.highlighted ? "text-blue-200" : "text-neutral-500"}`}>
                {plan.period}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 ${plan.highlighted ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${plan.highlighted ? "text-blue-200" : "text-green-500"}`} />
                  {feature.text}
                </li>
              ))}
            </ul>
            {plan.comingSoon ? (
              <button
                disabled
                className="block w-full py-3 text-center bg-white/20 text-white font-medium rounded-lg cursor-not-allowed"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                to="/register"
                className="block w-full py-3 text-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {plan.cta}
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
