import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { staggerContainer, staggerItem, pageVariants, pageTransition } from "../../lib/animations";
import { ScrollToTop } from "../ui";
import { BRAND } from "../landing/constants";
import { Header } from "../landing/Header";
import {
  ABOUT_HERO,
  ORIGIN_STORY,
  TIMELINE,
  PRINCIPLES,
  FEATURE_HIGHLIGHTS,
  VISION,
  CTA,
} from "./constants";

// ============================================================================
// Section Components
// ============================================================================

function HeroSection() {
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

function OriginStorySection() {
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

function TimelineSection() {
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

function PrinciplesSection() {
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

function FeaturesDeepDive() {
  return (
    <motion.section
      className="mt-24 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
        Features in Depth
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
        A closer look at what makes TaskFlow special
      </p>

      <div className="space-y-12">
        {FEATURE_HIGHLIGHTS.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full aspect-video bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                <Icon className="w-24 h-24 text-blue-600/30 dark:text-blue-400/30" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function VisionSection() {
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

function CTASection() {
  return (
    <motion.div
      className="mt-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
        {CTA.title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">{CTA.description}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg"
        >
          {CTA.primaryButton}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 text-neutral-700 dark:text-neutral-300 font-medium hover:text-neutral-900 dark:hover:text-white transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          {CTA.secondaryButton}
        </Link>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-neutral-900 dark:text-white">{BRAND.name}</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            About
          </Link>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">{BRAND.copyright}</p>
      </div>
    </footer>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AboutPage() {
  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <Header />
      <main className="container mx-auto px-6 pt-16 pb-24">
        <HeroSection />
        <OriginStorySection />
        <TimelineSection />
        <PrinciplesSection />
        <FeaturesDeepDive />
        <VisionSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </motion.div>
  );
}
