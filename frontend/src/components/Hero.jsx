import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Elements */}
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

      {/* Animated blobs */}
      <div className="blur-blob w-[600px] h-[600px] bg-purple-600/20 -top-40 -left-40 animate-float" />
      <div className="blur-blob w-[400px] h-[400px] bg-[#00F0FF]/10 bottom-20 right-10 animate-float" style={{ animationDelay: "2s" }} />
      <div className="blur-blob w-[300px] h-[300px] bg-[#FF0080]/10 top-1/3 right-1/4 animate-float" style={{ animationDelay: "4s" }} />

      {/* Animated grid lines */}
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
            Live on Mainnet
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-['Unbounded'] font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight mb-6"
        >
          The Future of{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient">Decentralized</span>{" "}
          <span className="text-gradient-cyan">Wealth</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Invest in next-generation blockchain protocols. Secure, transparent,
          and built for the future of digital finance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/market"
            data-testid="hero-cta-primary"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_30px_rgba(127,0,255,0.5)] transition-all duration-300 hover:scale-105"
          >
            Start Investing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            data-testid="hero-cta-secondary"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 backdrop-blur-md transition-all duration-300"
          >
            Learn More
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "$2.4B+", label: "Trading Volume" },
            { value: "150K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "200+", label: "Tokens Listed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-['Unbounded'] font-bold text-xl md:text-2xl text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-[#52525B] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-[#52525B]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
