import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks";
import { pageVariants, pageTransition } from "../../lib/animations";
import { ScrollToTop } from "../ui";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { DemoSection } from "./DemoSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { PricingSection } from "./PricingSection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

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
        <DemoSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </motion.div>
  );
}
