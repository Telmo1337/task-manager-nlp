import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "../../lib/animations";
import { HERO } from "./constants";

export function HeroSection() {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6"
        variants={staggerItem}
      >
        <Sparkles className="w-4 h-4" />
        {HERO.badge}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
        variants={staggerItem}
      >
        {HERO.title}
        <span className="text-blue-600 dark:text-blue-400">{HERO.titleHighlight}</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto"
        variants={staggerItem}
      >
        {HERO.description}
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        variants={staggerItem}
      >
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg"
        >
          {HERO.primaryCta}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 text-neutral-700 dark:text-neutral-300 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors text-lg"
        >
          {HERO.secondaryCta}
        </Link>
      </motion.div>
    </motion.div>
  );
}
