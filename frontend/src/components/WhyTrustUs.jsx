import { motion } from "framer-motion";
import { Shield, Clock, Users, Award, HeadphonesIcon, LineChart } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your investment is managed through verified crypto exchanges with bank-grade security. Complete transparency in every transaction.",
    accent: "#7F00FF",
  },
  {
    icon: Clock,
    title: "On-Time Payouts",
    description: "We have never missed a single payout in 3+ years. Your returns are credited to your account on the promised date, every time.",
    accent: "#00F0FF",
  },
  {
    icon: Users,
    title: "500+ Happy Investors",
    description: "From first-time investors to high-net-worth individuals, over 500 people trust us with their crypto portfolio across India.",
    accent: "#E056FD",
  },
  {
    icon: Award,
    title: "3+ Years Track Record",
    description: "Consistent 40% monthly returns for over 3 years. Our proven strategy works in both bull and bear markets.",
    accent: "#10B981",
  },
  {
    icon: HeadphonesIcon,
    title: "Personal Support",
    description: "Direct Telegram support. Get portfolio updates, ask questions, and track your investment anytime. No bots, real human assistance.",
    accent: "#FF0080",
  },
  {
    icon: LineChart,
    title: "Expert Management",
    description: "Professional crypto portfolio management using advanced trading strategies. You don't need to understand crypto - we handle everything.",
    accent: "#00F0FF",
  },
];

export default function WhyTrustUs() {
  return (
    <section id="features" data-testid="why-trust-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-purple-600/15 top-0 left-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#00F0FF] border border-cyan-500/30 bg-cyan-500/10 mb-6">
            Why Choose Us
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Why Investors{" "}
            <span className="text-gradient-cyan">Trust Us</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            We built our reputation on transparency, consistency, and results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-testid={`trust-card-${i}`}
              className="group relative p-8 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${reason.accent}10 0%, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${reason.accent}15`, border: `1px solid ${reason.accent}30` }}
                >
                  <reason.icon className="w-6 h-6" style={{ color: reason.accent }} />
                </div>
                <h3 className="font-['Unbounded'] font-semibold text-lg text-white mb-3">{reason.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
