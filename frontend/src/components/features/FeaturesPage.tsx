import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  pageVariants,
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../lib/animations";
import { ScrollToTop } from "../ui";
import { BRAND, FEATURES, FEATURE_COLORS, FEATURES_SECTION } from "../landing/constants";
import { ThemeToggle } from "../ui";

// ============================================================================
// Extended Features Data
// ============================================================================

const FEATURES_DETAILS = [
  {
    key: "natural-language",
    title: "Natural Language Processing",
    description:
      "TaskFlow understands how you naturally communicate. No need to learn special syntax or commands.",
    benefits: [
      "Type tasks like you're texting a friend",
      'Say "tomorrow at 3pm" instead of picking from calendars',
      "Automatic extraction of dates, times, and priorities",
      "Support for multiple languages coming soon",
    ],
    example: '"Remind me to call the dentist next Tuesday at 2pm"',
  },
  {
    key: "calendar",
    title: "Intuitive Calendar View",
    description:
      "See your schedule at a glance with our beautiful, responsive calendar interface.",
    benefits: [
      "Month, week, and day views",
      "Color-coded by priority level",
      "Click any date to add or view tasks",
      "Drag and drop to reschedule",
    ],
    example: "Click any day to see all tasks, hover to preview",
  },
  {
    key: "smart-scheduling",
    title: "Smart Scheduling",
    description:
      "TaskFlow understands complex time expressions and recurring patterns automatically.",
    benefits: [
      '"Every weekday at 9am" creates recurring tasks',
      '"In 2 hours" calculates the exact time',
      '"Next month" understands context',
      "Timezone-aware scheduling",
    ],
    example: '"Water the plants every Sunday morning"',
  },
  {
    key: "priorities",
    title: "Priority Management",
    description:
      "Focus on what matters most with our intelligent priority system.",
    benefits: [
      "Four priority levels: urgent, high, normal, low",
      "Visual indicators and sorting",
      'Natural language: "urgent: finish report"',
      "Priority-based task suggestions",
    ],
    example: '"High priority: prepare presentation for Monday"',
  },
  {
    key: "security",
    title: "Security & Privacy",
    description:
      "Your data is protected with industry-standard encryption and security practices.",
    benefits: [
      "End-to-end encryption for all data",
      "No third-party data sharing",
      "Regular security audits",
      "GDPR compliant",
    ],
    example: "Your tasks are yours alone",
  },
  {
    key: "recurring",
    title: "Recurring Tasks",
    description:
      "Set it once, forget about it. TaskFlow handles the rest.",
    benefits: [
      "Daily, weekly, monthly patterns",
      "Custom intervals (every 3 days)",
      "Skip or modify single occurrences",
      "End dates for temporary recurrences",
    ],
    example: '"Take vitamins every morning at 8am"',
  },
];

// ============================================================================
// Header Component
// ============================================================================

function FeaturesHeader() {
  return (
    <header className="container mx-auto px-6 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-bold text-neutral-900 dark:text-white">{BRAND.name}</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/"
          className="relative text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
        >
          Home
        </Link>
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Features</span>
        <Link
          to="/pricing"
          className="relative text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
        >
          Pricing
        </Link>
        <Link
          to="/about"
          className="relative text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
        >
          About
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/login"
          className="hidden md:block px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

// ============================================================================
// Hero Section
// ============================================================================

function HeroSection() {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto mb-20"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6"
        variants={staggerItem}
      >
        Powerful Features,{" "}
        <span className="text-blue-600 dark:text-blue-400">Simple Experience</span>
      </motion.h1>
      <motion.p
        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
        variants={staggerItem}
      >
        {FEATURES_SECTION.description}. Discover how TaskFlow transforms the way you manage your daily tasks.
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// Features Grid
// ============================================================================

function FeaturesGrid() {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        const colors = FEATURE_COLORS[feature.color];
        return (
          <motion.div
            key={feature.title}
            className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow"
            variants={staggerItem}
            whileHover={{ y: -4 }}
          >
            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ============================================================================
// Feature Details Section
// ============================================================================

function FeatureDetails() {
  return (
    <div className="space-y-24">
      {FEATURES_DETAILS.map((detail, index) => (
        <motion.div
          key={detail.key}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {detail.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {detail.description}
            </p>
            <ul className="space-y-3 mb-6">
              {detail.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Example:</p>
              <p className="text-neutral-900 dark:text-white font-medium">{detail.example}</p>
            </div>
          </div>

          {/* Visual placeholder */}
          <div className="flex-1 w-full">
            <div className="aspect-video bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 dark:bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  {FEATURES[index % FEATURES.length] && (
                    (() => {
                      const Icon = FEATURES[index % FEATURES.length].icon;
                      return <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
                    })()
                  )}
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Interactive demo coming soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// CTA Section
// ============================================================================

function CTASection() {
  return (
    <motion.div
      className="mt-24 text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-4">
        Ready to experience these features?
      </h2>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Start managing your tasks the natural way. No credit card required.
      </p>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
      >
        Get Started Free
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  );
}

// ============================================================================
// Footer
// ============================================================================

function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{BRAND.copyright}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export function FeaturesPage() {
  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <FeaturesHeader />
      <main className="container mx-auto px-6 pt-16 pb-24">
        <HeroSection />
        <FeaturesGrid />
        <FeatureDetails />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </motion.div>
  );
}

export default FeaturesPage;
