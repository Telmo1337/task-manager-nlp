import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../../lib/animations";
import { ScrollToTop } from "../ui";
import { Header } from "../landing/Header";
import { HeroSection } from "./HeroSection";
import { OriginStorySection } from "./OriginStorySection";
import { TimelineSection } from "./TimelineSection";
import { PrinciplesSection } from "./PrinciplesSection";
import { FeaturesDeepDive } from "./FeaturesDeepDive";
import { VisionSection } from "./VisionSection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

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

export default AboutPage;

