import { motion } from "framer-motion";
import { Check } from "lucide-react";

const phases = [
  {
    quarter: "Q1 2025",
    title: "Foundation",
    items: ["Protocol Architecture Design", "Core Team Assembly", "Whitepaper Release", "Community Launch"],
    status: "completed",
    accent: "#10B981",
  },
  {
    quarter: "Q2 2025",
    title: "Development",
    items: ["Smart Contract Development", "Security Audit (Phase 1)", "Testnet Alpha Launch", "Early Adopter Program"],
    status: "completed",
    accent: "#10B981",
  },
  {
    quarter: "Q3 2025",
    title: "Growth",
    items: ["Mainnet Launch", "DEX Listing", "Staking Platform Live", "Mobile App Beta"],
    status: "active",
    accent: "#7F00FF",
  },
  {
    quarter: "Q4 2025",
    title: "Expansion",
    items: ["Cross-chain Bridge", "Governance DAO", "CEX Partnerships", "DeFi Integrations"],
    status: "upcoming",
    accent: "#52525B",
  },
  {
    quarter: "Q1 2026",
    title: "Scale",
    items: ["Layer 2 Scaling", "Institutional APIs", "Global Regulatory Compliance", "Ecosystem Fund Launch"],
    status: "upcoming",
    accent: "#52525B",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" data-testid="roadmap-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[400px] h-[400px] bg-purple-600/15 top-1/3 left-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E056FD] border border-purple-500/30 bg-purple-500/10 mb-6">
            Timeline
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            The <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Our journey to building the future of decentralized finance.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7F00FF] via-[#E056FD] to-[#52525B]" />

          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-testid={`roadmap-phase-${i}`}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 z-10 mt-6"
                  style={{
                    backgroundColor: phase.accent,
                    boxShadow: phase.status === "active" ? `0 0 15px ${phase.accent}` : "none",
                  }}
                />

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                    phase.status === "active"
                      ? "bg-[#0F0518]/80 border-purple-500/30 shadow-[0_0_20px_rgba(127,0,255,0.15)]"
                      : phase.status === "completed"
                        ? "bg-[#0F0518]/40 border-emerald-500/20"
                        : "bg-[#0F0518]/30 border-white/[0.04]"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-['JetBrains_Mono'] text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          color: phase.accent,
                          backgroundColor: `${phase.accent}15`,
                          border: `1px solid ${phase.accent}30`,
                        }}
                      >
                        {phase.quarter}
                      </span>
                      {phase.status === "active" && (
                        <span className="text-xs text-[#7F00FF] font-semibold animate-pulse">CURRENT</span>
                      )}
                    </div>
                    <h3 className="font-['Unbounded'] font-semibold text-lg text-white mb-3">
                      {phase.title}
                    </h3>
                    <ul className="space-y-2">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          {phase.status === "completed" ? (
                            <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: phase.accent }} />
                          )}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
