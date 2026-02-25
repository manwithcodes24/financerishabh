import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Send } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Hero() {
  const [telegramLink, setTelegramLink] = useState("https://t.me/wealthx_invest");

  useEffect(() => {
    axios.get(`${API}/settings`).then(res => {
      if (res.data.telegram_link) setTelegramLink(res.data.telegram_link);
    }).catch(() => {});
  }, []);

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1758979616631-d425001a1f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRhcmslMjBwdXJwbGUlMjBmdXR1cmlzdGljJTIwM2QlMjBzaGFwZXN8ZW58MHx8fHwxNzcyMDIyMzYyfDA&ixlib=rb-4.1.0&q=85)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/60 via-[#030014]/80 to-[#030014]" />
      </div>

      {/* Blobs */}
      <div className="blur-blob w-[600px] h-[600px] bg-purple-600/20 -top-40 -left-40 animate-float" />
      <div className="blur-blob w-[400px] h-[400px] bg-[#00F0FF]/10 bottom-20 right-10 animate-float" style={{ animationDelay: "2s" }} />

      {/* Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(127,0,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(127,0,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm font-medium text-[#A1A1AA] font-['JetBrains_Mono']">
            Trusted by 500+ Investors Across India
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-['Unbounded'] font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight mb-6"
        >
          Your Crypto,{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient">My Expertise.</span>{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient-cyan">Up to 40% Returns.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I professionally manage your crypto portfolio so you don't have to worry about market volatility. 
          Invest with confidence and earn up to <span className="text-[#10B981] font-semibold">40% returns every month</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#schemes"
            data-testid="hero-cta-primary"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_30px_rgba(127,0,255,0.5)] transition-all duration-300 hover:scale-105"
          >
            View Investment Plans
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-cta-telegram"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 backdrop-blur-md transition-all duration-300"
          >
            <Send className="w-5 h-5" />
            Contact on Telegram
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "500+", label: "Happy Investors" },
            { value: "40%", label: "Monthly Returns" },
            { value: "3+ Yrs", label: "Experience" },
            { value: "Rs.8Cr+", label: "Portfolio Managed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-['Unbounded'] font-bold text-xl md:text-2xl text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-[#52525B] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
