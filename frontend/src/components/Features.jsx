import { motion } from "framer-motion";
import { Shield, Zap, Globe, Layers, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Multi-layer encryption with cold storage custody. Your assets are protected 24/7.",
    accent: "#7F00FF",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Execute trades in under 50ms with our advanced matching engine.",
    accent: "#00F0FF",
    span: "col-span-1",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Trade from anywhere in the world. 24/7 markets with zero downtime.",
    accent: "#E056FD",
    span: "col-span-1",
  },
  {
    icon: Layers,
    title: "Multi-Chain Support",
    description: "Seamlessly trade across Ethereum, Solana, Polygon, Arbitrum and 50+ chains.",
    accent: "#FF0080",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Lock,
    title: "Non-Custodial",
    description: "You hold your keys. True decentralized ownership of your assets.",
    accent: "#10B981",
    span: "col-span-1",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "AI-powered market insights and portfolio tracking to maximize your returns.",
    accent: "#00F0FF",
    span: "col-span-1 md:col-span-2",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Features() {
  return (
    <section id="features" data-testid="features-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-purple-600/15 top-0 left-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E056FD] border border-purple-500/30 bg-purple-500/10 mb-6">
            Why NovaX
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Built for the{" "}
            <span className="text-gradient">Next Era</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Enterprise-grade infrastructure meets elegant simplicity.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={`${feature.span} group relative p-8 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-500 overflow-hidden backdrop-blur-sm`}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${feature.accent}10 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `${feature.accent}15`,
                    border: `1px solid ${feature.accent}30`,
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.accent }} />
                </div>
                <h3 className="font-['Unbounded'] font-semibold text-lg text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
