import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CryptoTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get(`${API}/crypto/top-coins?limit=10`);
        setCoins(res.data.coins || []);
      } catch (err) {
        console.error("Ticker fetch error:", err);
      }
    };
    fetchCoins();
    const interval = setInterval(fetchCoins, 120000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  const tickerItems = [...coins, ...coins]; // duplicate for seamless loop

  return (
    <div data-testid="crypto-ticker" className="relative overflow-hidden py-4 border-y border-white/[0.04] bg-[#030014]/80 backdrop-blur-sm">
      <motion.div
        className="flex gap-8 items-center whitespace-nowrap animate-ticker"
        style={{ width: "fit-content" }}
      >
        {tickerItems.map((coin, i) => {
          const isUp = (coin.price_change_percentage_24h || 0) >= 0;
          return (
            <div key={`${coin.id}-${i}`} className="flex items-center gap-3 px-4">
              {coin.image && (
                <img src={coin.image} alt={coin.symbol} className="w-5 h-5 rounded-full" />
              )}
              <span className="text-sm font-medium text-white">{coin.symbol}</span>
              <span className="text-sm font-['JetBrains_Mono'] text-[#A1A1AA]">
                ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-['JetBrains_Mono'] ${isUp ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {isUp ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
