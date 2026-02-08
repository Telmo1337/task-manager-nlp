import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CTA } from "./constants";

export function CTASection() {
  return (
    <motion.div
      className="mt-32 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
        {CTA.title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">{CTA.description}</p>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg"
      >
        {CTA.button}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  );
}
