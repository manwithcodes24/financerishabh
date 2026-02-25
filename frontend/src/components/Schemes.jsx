import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatINR(num) {
  if (num >= 100000) return `Rs.${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} Lakhs`;
  if (num >= 1000) return `Rs.${(num / 1000).toFixed(0)}K`;
  return `Rs.${num}`;
}

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [telegramLink, setTelegramLink] = useState("https://t.me/wealthx_invest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, settingsRes] = await Promise.all([
          axios.get(`${API}/schemes`),
          axios.get(`${API}/settings`),
        ]);
        setSchemes(schemesRes.data.schemes || []);
        if (settingsRes.data.telegram_link) setTelegramLink(settingsRes.data.telegram_link);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="schemes" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="text-[#A1A1AA]">Loading investment plans...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="schemes" data-testid="schemes-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-purple-600/15 top-0 left-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E056FD] border border-purple-500/30 bg-purple-500/10 mb-6">
            Investment Plans
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Choose Your{" "}
            <span className="text-gradient">Plan</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Select a plan that matches your investment goals. All plans offer 40% returns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {schemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-testid={`scheme-card-${i}`}
              className={`relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                scheme.is_popular
                  ? "bg-[#0F0518]/80 border-purple-500/40 shadow-[0_0_25px_rgba(127,0,255,0.15)]"
                  : "bg-[#0F0518]/50 border-white/[0.06] hover:border-purple-500/20"
              }`}
            >
              {scheme.is_popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-xl rounded-tr-2xl bg-gradient-to-r from-[#7F00FF] to-[#E056FD] text-white border-0 px-3 py-1 text-xs font-bold">
                    <Star className="w-3 h-3 mr-1 inline" /> POPULAR
                  </Badge>
                </div>
              )}

              <h3 className="font-['Unbounded'] font-bold text-lg text-white mb-2">
                {scheme.title}
              </h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-['Unbounded'] font-extrabold text-3xl text-gradient">
                  {scheme.return_percentage}%
                </span>
                <span className="text-sm text-[#52525B]">returns</span>
              </div>
              <div className="text-xs text-[#52525B] mb-5">
                Duration: {scheme.duration_months} month{scheme.duration_months > 1 ? "s" : ""}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  Min: {formatINR(scheme.min_investment)}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  Max: {formatINR(scheme.max_investment)}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  Expert Portfolio Management
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  Monthly Payout
                </div>
              </div>

              <p className="text-xs text-[#52525B] mb-5 leading-relaxed">{scheme.description}</p>

              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`scheme-cta-${i}`}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  scheme.is_popular
                    ? "text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_20px_rgba(127,0,255,0.4)]"
                    : "text-white border border-white/20 hover:bg-white/5"
                }`}
              >
                Invest Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
