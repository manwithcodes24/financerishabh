import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Zap, Send, ArrowUpRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const footerLinks = {
  Invest: ["Investment Plans", "Returns Calculator", "Why Trust Us", "Testimonials"],
  Resources: ["Live Market", "FAQ", "Contact Us", "WhatsApp"],
  Legal: ["Terms of Service", "Privacy Policy", "Disclaimer", "Risk Warning"],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/newsletter/subscribe`, { email });
      if (res.data.status === "exists") {
        toast.info("You're already subscribed!");
      } else {
        toast.success("Successfully subscribed!");
      }
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="footer-section" className="relative border-t border-white/[0.04] pt-20 pb-8">
      <div className="blur-blob w-[600px] h-[400px] bg-purple-600/10 -bottom-40 left-1/3" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 p-8 md:p-12 rounded-2xl bg-[#0F0518]/60 border border-white/[0.06] backdrop-blur-sm"
        >
          <h3 className="font-['Unbounded'] font-bold text-xl md:text-2xl text-white mb-3">
            Stay Ahead of the Market
          </h3>
          <p className="text-sm text-[#A1A1AA] mb-6 max-w-md mx-auto">
            Get exclusive insights, market analysis, and early access to new features.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              data-testid="newsletter-email-input"
              className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525B] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="newsletter-submit-button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_25px_rgba(127,0,255,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </motion.div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7F00FF] to-[#E056FD] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-['Unbounded'] font-bold text-base text-white">
                Wealth<span className="text-[#E056FD]">X</span>
              </span>
            </div>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Professional crypto portfolio management. Invest with confidence, earn up to 40% monthly returns.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-[#52525B] hover:text-[#E056FD] transition-colors flex items-center gap-1 group"
                    >
                      {link}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#52525B]">
            &copy; 2025 WealthX Investments. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#52525B]">Contact: +91 7080682448</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs text-[#10B981] font-['JetBrains_Mono']">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
