import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "RS",
    text: "I was skeptical at first but decided to try with Rs.20,000. Got back Rs.28,000 in exactly one month. Now I invest Rs.1 Lakh regularly. Best decision I made!",
    investment: "Rs.1,00,000",
    returns: "Rs.1,40,000",
    rating: 5,
  },
  {
    name: "Priya Patel",
    location: "Ahmedabad, Gujarat",
    avatar: "PP",
    text: "My husband was against crypto but when he saw the returns in my first month, he started investing too. We both invest Rs.50,000 each now. Very transparent and trustworthy.",
    investment: "Rs.50,000",
    returns: "Rs.70,000",
    rating: 5,
  },
  {
    name: "Amit Kumar Singh",
    location: "Lucknow, UP",
    avatar: "AS",
    text: "I have been investing for 6 months now. Never missed a single payout. Started with Rs.5,000 and now I invest Rs.2 Lakhs. The best part is I don't have to do anything - everything is managed.",
    investment: "Rs.2,00,000",
    returns: "Rs.2,80,000",
    rating: 5,
  },
  {
    name: "Sunita Devi",
    location: "Jaipur, Rajasthan",
    avatar: "SD",
    text: "As a housewife, I saved some money and invested Rs.10,000. When I received Rs.14,000 back, I was so happy! Now my whole family invests here. Very reliable and genuine person.",
    investment: "Rs.10,000",
    returns: "Rs.14,000",
    rating: 5,
  },
  {
    name: "Vikram Reddy",
    location: "Hyderabad, Telangana",
    avatar: "VR",
    text: "I lost money in stock market before. A friend recommended this. I started small with Rs.5,000. The returns came on time. Now I am a regular investor with Rs.5 Lakhs. Highly recommended!",
    investment: "Rs.5,00,000",
    returns: "Rs.7,00,000",
    rating: 5,
  },
  {
    name: "Deepak Nair",
    location: "Kochi, Kerala",
    avatar: "DN",
    text: "I am an IT professional and I know about crypto. What impressed me is the consistent 40% returns. The portfolio management is top-notch. I get weekly updates on my investment.",
    investment: "Rs.3,00,000",
    returns: "Rs.4,20,000",
    rating: 5,
  },
];

const accentColors = ["#7F00FF", "#E056FD", "#00F0FF", "#FF0080", "#10B981", "#7F00FF"];

export default function Testimonials() {
  return (
    <section id="testimonials" data-testid="testimonials-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[400px] h-[400px] bg-[#FF0080]/10 bottom-0 left-1/3" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#FF0080] border border-pink-500/30 bg-pink-500/10 mb-6">
            Happy Investors
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            What Our{" "}
            <span className="text-gradient">Investors Say</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Real stories from real investors across India who trust us with their money.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-testid={`testimonial-card-${i}`}
              className="group relative p-6 rounded-2xl bg-[#0F0518]/50 border border-white/[0.06] hover:border-purple-500/20 transition-all duration-500 backdrop-blur-sm"
            >
              <Quote className="w-8 h-8 text-purple-500/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#E056FD] text-[#E056FD]" />
                ))}
              </div>

              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-5">"{t.text}"</p>

              {/* Returns badge */}
              <div className="flex gap-3 mb-5">
                <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[10px] text-[#52525B] mb-0.5">Invested</div>
                  <div className="text-xs font-['JetBrains_Mono'] font-bold text-white">{t.investment}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[10px] text-[#52525B] mb-0.5">Received</div>
                  <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#10B981]">{t.returns}</div>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${accentColors[i]}, ${accentColors[(i + 1) % accentColors.length]})` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-[#52525B]">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
