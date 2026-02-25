import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CryptoTicker from "@/components/CryptoTicker";

export default function LandingPage() {
  return (
    <main data-testid="landing-page">
      <Hero />
      <CryptoTicker />
      <Features />
      <Tokenomics />
      <Roadmap />
      <FAQ />
      <Footer />
    </main>
  );
}
