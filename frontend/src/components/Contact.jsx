import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Phone, MapPin, Clock } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [telegramLink, setTelegramLink] = useState("https://t.me/wealthx_invest");

  useEffect(() => {
    axios.get(`${API}/settings`).then(res => {
      if (res.data.telegram_link) setTelegramLink(res.data.telegram_link);
    }).catch(() => {});
  }, []);

  return (
    <section id="contact" data-testid="contact-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[400px] h-[400px] bg-purple-600/15 top-1/3 right-0" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E056FD] border border-purple-500/30 bg-purple-500/10 mb-6">
            Get In Touch
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Ready to{" "}
            <span className="text-gradient">Invest?</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Contact us directly on Telegram to get started. We'll guide you through the entire process.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Telegram Card */}
          <motion.a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-testid="contact-telegram"
            className="group p-8 rounded-2xl bg-[#0F0518]/60 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-500 backdrop-blur-sm cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Send className="w-7 h-7 text-[#00F0FF]" />
            </div>
            <h3 className="font-['Unbounded'] font-semibold text-xl text-white mb-2">Telegram</h3>
            <p className="text-[#A1A1AA] text-sm mb-3">Message us directly for quick response</p>
            <span className="font-['JetBrains_Mono'] text-base text-[#00F0FF] font-bold">Connect on Telegram</span>
          </motion.a>

          {/* Phone Card */}
          <motion.a
            href="tel:+917080682448"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            data-testid="contact-phone"
            className="group p-8 rounded-2xl bg-[#0F0518]/60 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(127,0,255,0.15)] transition-all duration-500 backdrop-blur-sm cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-7 h-7 text-[#E056FD]" />
            </div>
            <h3 className="font-['Unbounded'] font-semibold text-xl text-white mb-2">Call Us</h3>
            <p className="text-[#A1A1AA] text-sm mb-3">Prefer talking? Give us a call</p>
            <span className="font-['JetBrains_Mono'] text-lg text-[#E056FD] font-bold">+91 7080682448</span>
          </motion.a>
        </div>

        {/* Info Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#52525B]"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Available 10 AM - 10 PM IST</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Serving investors across India</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
