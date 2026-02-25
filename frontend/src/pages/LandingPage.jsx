import Hero from "@/components/Hero";
import InvestmentExamples from "@/components/InvestmentExamples";
import Schemes from "@/components/Schemes";
import WhyTrustUs from "@/components/WhyTrustUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CryptoTicker from "@/components/CryptoTicker";

export default function LandingPage() {
  return (
    <main data-testid="landing-page">
      <Hero />
      <CryptoTicker />
      <InvestmentExamples />
      <Schemes />
      <WhyTrustUs />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
