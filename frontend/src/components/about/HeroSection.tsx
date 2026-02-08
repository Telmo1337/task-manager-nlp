import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { staggerContainer, staggerItem } from "../../lib/animations";
import { ABOUT_HERO } from "./constants";

export function HeroSection() {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6"
        variants={staggerItem}
      >
        <Sparkles className="w-4 h-4" />
        {ABOUT_HERO.badge}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
        variants={staggerItem}
      >
        {ABOUT_HERO.title}
        <span className="text-blue-600 dark:text-blue-400">{ABOUT_HERO.titleHighlight}</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
        variants={staggerItem}
      >
        {ABOUT_HERO.description}
      </motion.p>
    </motion.div>
  );
}
