import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const examples = [
  { invest: 5000, returns: 7000, label: "5K" },
  { invest: 10000, returns: 14000, label: "10K" },
  { invest: 20000, returns: 28000, label: "20K" },
  { invest: 50000, returns: 70000, label: "50K" },
  { invest: 100000, returns: 140000, label: "1 Lakh" },
  { invest: 500000, returns: 700000, label: "5 Lakhs" },
];

function formatINR(num) {
  if (num >= 100000) return `Rs.${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} Lakhs`;
  if (num >= 1000) return `Rs.${(num / 1000).toFixed(0)}K`;
  return `Rs.${num}`;
}

export default function InvestmentExamples() {
  return (
    <section id="returns" data-testid="investment-examples-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-[#10B981]/10 top-0 right-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#10B981] border border-emerald-500/30 bg-emerald-500/10 mb-6">
            See Your Returns
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Invest Today,{" "}
            <span className="text-gradient">Earn 40%</span>{" "}
            Returns
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto">
            Here's exactly how much you earn. No hidden charges, no complicated math. 
            You invest, I manage, you earn. Simple as that.
          </p>
        </motion.div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.invest}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-testid={`investment-example-${i}`}
              className="group relative p-6 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
              whileHover={{ y: -4 }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#52525B] font-medium">You Invest</span>
                  <TrendingUp className="w-5 h-5 text-[#10B981]" />
                </div>

                <div className="font-['Unbounded'] font-bold text-2xl text-white mb-1">
                  Rs.{ex.invest.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-[#52525B] mb-5">Minimum 1 month</div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-emerald-500/30" />
                  <ArrowRight className="w-4 h-4 text-[#E056FD]" />
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-purple-500/30" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#10B981] font-medium">You Get Back</span>
                  <span className="text-xs font-['JetBrains_Mono'] text-[#E056FD] bg-purple-500/10 px-2 py-1 rounded-full">
                    +40%
                  </span>
                </div>
                <div className="font-['Unbounded'] font-bold text-2xl text-[#10B981] mt-1">
                  Rs.{ex.returns.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-[#52525B] mt-1">
                  Profit: Rs.{(ex.returns - ex.invest).toLocaleString("en-IN")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://wa.me/917080682448?text=Hi%2C%20I%20am%20interested%20in%20investing.%20Can%20you%20share%20more%20details%3F"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="investment-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105"
          >
            Start Investing Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
