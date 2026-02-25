import { motion } from "framer-motion";

const tokenomicsData = [
  { label: "Public Sale", pct: 35, color: "#7F00FF" },
  { label: "Ecosystem & Development", pct: 25, color: "#E056FD" },
  { label: "Team & Advisors", pct: 15, color: "#00F0FF" },
  { label: "Liquidity Pool", pct: 10, color: "#FF0080" },
  { label: "Staking Rewards", pct: 10, color: "#10B981" },
  { label: "Reserve", pct: 5, color: "#52525B" },
];

export default function Tokenomics() {
  const total = tokenomicsData.reduce((a, b) => a + b.pct, 0);

  return (
    <section data-testid="tokenomics-section" className="relative py-24 md:py-32">
      <div className="blur-blob w-[500px] h-[500px] bg-[#00F0FF]/10 bottom-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#00F0FF] border border-cyan-500/30 bg-cyan-500/10 mb-6">
            Token Distribution
          </span>
          <h2 className="font-['Unbounded'] font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            <span className="text-gradient-cyan">Tokenomics</span>
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl mx-auto">
            Transparent allocation designed for long-term sustainability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Ring Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="w-72 h-72 md:w-80 md:h-80">
              {(() => {
                let cumulative = 0;
                return tokenomicsData.map((item, i) => {
                  const startAngle = (cumulative / total) * 360;
                  const sweepAngle = (item.pct / total) * 360;
                  cumulative += item.pct;

                  const r = 70;
                  const cx = 100;
                  const cy = 100;
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((startAngle + sweepAngle - 90) * Math.PI) / 180;
                  const x1 = cx + r * Math.cos(startRad);
                  const y1 = cy + r * Math.sin(startRad);
                  const x2 = cx + r * Math.cos(endRad);
                  const y2 = cy + r * Math.sin(endRad);
                  const largeArc = sweepAngle > 180 ? 1 : 0;

                  const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                  return (
                    <motion.path
                      key={item.label}
                      d={pathData}
                      fill={item.color}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 0.85, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      style={{ transformOrigin: "100px 100px" }}
                      className="hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  );
                });
              })()}
              <circle cx="100" cy="100" r="42" fill="#030014" />
              <text x="100" y="96" textAnchor="middle" fill="white" fontSize="10" fontFamily="Unbounded" fontWeight="800">
                1B
              </text>
              <text x="100" y="112" textAnchor="middle" fill="#A1A1AA" fontSize="6" fontFamily="Inter">
                Total Supply
              </text>
            </svg>
          </motion.div>

          {/* Legend */}
          <div className="space-y-4">
            {tokenomicsData.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                data-testid={`tokenomics-item-${i}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-purple-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#A1A1AA]">{item.label}</span>
                </div>
                <span className="font-['JetBrains_Mono'] font-bold text-white">{item.pct}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
