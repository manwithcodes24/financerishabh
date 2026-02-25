import { motion } from "framer-motion";
import { Linkedin, Award } from "lucide-react";

const team = [
  {
    name: "Ankur Agrawal",
    role: "Founder & Lead Portfolio Manager",
    initials: "AA",
    bio: "8+ years in crypto trading. Managed Rs.50Cr+ in portfolios. Expert in DeFi and spot trading strategies.",
    gradient: "from-[#7F00FF] to-[#E056FD]",
  },
  {
    name: "Radhika Gupta",
    role: "Senior Investment Analyst",
    initials: "RG",
    bio: "Former equity analyst turned crypto specialist. Identifies high-potential tokens before they trend. CA qualified.",
    gradient: "from-[#E056FD] to-[#FF0080]",
  },
  {
    name: "Abhay Sharma",
    role: "Risk Management Head",
    initials: "AS",
    bio: "Ensures every portfolio stays within safe risk boundaries. 6+ years in financial risk analysis and hedging strategies.",
    gradient: "from-[#00F0FF] to-[#7F00FF]",
  },
  {
    name: "Rishabh Singh",
    role: "Client Relations Manager",
    initials: "RS",
    bio: "Your first point of contact. Handles onboarding, queries, and ensures every investor has a smooth experience.",
    gradient: "from-[#10B981] to-[#00F0FF]",
  },
];

export default function Team() {
  return (
    <section id="team" data-testid="team-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-[#E056FD]/10 top-0 right-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E056FD] border border-purple-500/30 bg-purple-500/10 mb-6">
            Our Team
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            The People Behind{" "}
            <span className="text-gradient">Your Wealth</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            A dedicated team of finance and crypto experts managing your investments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-testid={`team-member-${i}`}
              className="group relative p-6 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-500 overflow-hidden backdrop-blur-sm text-center"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 30%, rgba(224,86,253,0.06) 0%, transparent 70%)" }}
              />

              <div className="relative z-10">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="font-['Unbounded'] font-bold text-xl text-white">{member.initials}</span>
                </div>

                <h3 className="font-['Unbounded'] font-semibold text-base text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-[#E056FD] font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {member.bio}
                </p>

                {/* Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <Award className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[10px] text-[#52525B] font-medium">Verified Expert</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
