import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, X, ArrowRight, HelpCircle } from "lucide-react";
import {
  pageVariants,
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../lib/animations";
import { ScrollToTop, ThemeToggle } from "../ui";
import { BRAND, PRICING_PLANS, PRICING_SECTION } from "../landing/constants";

// ============================================================================
// Extended Pricing Data
// ============================================================================

const COMPARISON_FEATURES = [
  { name: "Unlimited tasks", free: true, pro: true },
  { name: "Natural language input", free: true, pro: true },
  { name: "Calendar view", free: true, pro: true },
  { name: "Priority levels", free: true, pro: true },
  { name: "Recurring tasks", free: true, pro: true },
  { name: "Mobile-friendly", free: true, pro: true },
  { name: "Team workspaces", free: false, pro: true },
  { name: "Shared task lists", free: false, pro: true },
  { name: "Advanced analytics", free: false, pro: true },
  { name: "Export to CSV/PDF", free: false, pro: true },
  { name: "API access", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
];

const FAQS = [
  {
    question: "Can I really use TaskFlow for free?",
    answer:
      "Yes! Our free tier includes unlimited tasks, natural language input, calendar view, and all core features. It's perfect for personal use and will remain free forever.",
  },
  {
    question: "What happens when Pro launches?",
    answer:
      "When Pro launches, you'll have the option to upgrade for team features and advanced analytics. Your free account and all your data will remain intact.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption for all data. Your tasks are private and we never share your information with third parties.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Free users can export their data in JSON format. Pro users will get additional export options including CSV and PDF formats.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "When Pro launches, we'll offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.",
  },
];

// ============================================================================
// Header Component
// ============================================================================

function PricingHeader() {
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
        <Link
          to="/features"
          className="relative text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
        >
          Features
        </Link>
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Pricing</span>
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
      className="text-center max-w-3xl mx-auto mb-16"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6"
        variants={staggerItem}
      >
        {PRICING_SECTION.title}
      </motion.h1>
      <motion.p
        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto"
        variants={staggerItem}
      >
        {PRICING_SECTION.description}. No hidden fees, no credit card required to get started.
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// Pricing Cards
// ============================================================================

function PricingCards() {
  return (
    <motion.div
      className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {PRICING_PLANS.map((plan) => (
        <motion.div
          key={plan.name}
          className={`p-8 rounded-2xl relative overflow-hidden ${
            plan.highlighted
              ? "bg-blue-600"
              : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          }`}
          variants={staggerItem}
          whileHover={{ scale: 1.02 }}
        >
          {plan.comingSoon && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
              Coming Soon
            </div>
          )}
          <h3
            className={`text-2xl font-bold mb-2 ${
              plan.highlighted ? "text-white" : "text-neutral-900 dark:text-white"
            }`}
          >
            {plan.name}
          </h3>
          <p
            className={`mb-4 ${
              plan.highlighted ? "text-blue-100" : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {plan.description}
          </p>
          <div
            className={`text-5xl font-bold mb-2 ${
              plan.highlighted ? "text-white" : "text-neutral-900 dark:text-white"
            }`}
          >
            {plan.price}
            <span
              className={`text-lg font-normal ${
                plan.highlighted ? "text-blue-200" : "text-neutral-500"
              }`}
            >
              {plan.period}
            </span>
          </div>
          <p
            className={`text-sm mb-8 ${
              plan.highlighted ? "text-blue-200" : "text-neutral-500"
            }`}
          >
            {plan.name === "Free" ? "Free forever" : "Billed annually"}
          </p>
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 ${
                  plan.highlighted ? "text-white" : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${
                    plan.highlighted ? "text-blue-200" : "text-green-500"
                  }`}
                />
                {feature.text}
              </li>
            ))}
          </ul>
          {plan.comingSoon ? (
            <button
              disabled
              className="block w-full py-4 text-center bg-white/20 text-white font-medium rounded-xl cursor-not-allowed"
            >
              {plan.cta}
            </button>
          ) : (
            <Link
              to="/register"
              className="block w-full py-4 text-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {plan.cta}
            </Link>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// Comparison Table
// ============================================================================

function ComparisonTable() {
  return (
    <motion.div
      className="max-w-3xl mx-auto mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white text-center mb-8">
        Compare Plans
      </h2>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Features</div>
          <div className="text-center text-sm font-semibold text-neutral-900 dark:text-white">Free</div>
          <div className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400">Pro</div>
        </div>
        {/* Rows */}
        {COMPARISON_FEATURES.map((feature, index) => (
          <div
            key={feature.name}
            className={`grid grid-cols-3 gap-4 p-4 ${
              index !== COMPARISON_FEATURES.length - 1
                ? "border-b border-neutral-100 dark:border-neutral-800"
                : ""
            }`}
          >
            <div className="text-sm text-neutral-700 dark:text-neutral-300">{feature.name}</div>
            <div className="flex justify-center">
              {feature.free ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
              )}
            </div>
            <div className="flex justify-center">
              {feature.pro ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// FAQ Section
// ============================================================================

function FAQSection() {
  return (
    <motion.div
      className="max-w-3xl mx-auto mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 justify-center mb-8">
        <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              {faq.question}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CTA Section
// ============================================================================

function CTASection() {
  return (
    <motion.div
      className="text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-4">Start organizing today</h2>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Join thousands of users who've simplified their task management with natural language.
      </p>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
      >
        Create Free Account
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
            <Link
              to="/features"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              About
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

export function PricingPage() {
  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <PricingHeader />
      <main className="container mx-auto px-6 pt-16 pb-24">
        <HeroSection />
        <PricingCards />
        <ComparisonTable />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </motion.div>
  );
}
