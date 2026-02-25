import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, Flame, BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatNumber(num) {
  if (!num) return "$0";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPrice(price) {
  if (!price) return "$0.00";
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(6)}`;
}

function MiniSparkline({ data, isPositive }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const sampled = data.filter((_, i) => i % Math.ceil(data.length / 30) === 0);
  const chartData = sampled.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width={100} height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={isPositive ? "#10B981" : "#EF4444"}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function MarketPage() {
  const [coins, setCoins] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [coinsRes, globalRes, trendingRes] = await Promise.all([
        axios.get(`${API}/crypto/top-coins?limit=20`),
        axios.get(`${API}/crypto/global`),
        axios.get(`${API}/crypto/trending`),
      ]);
      setCoins(coinsRes.data.coins || []);
      setGlobalStats(globalRes.data);
      setTrending(trendingRes.data.trending || []);
    } catch (err) {
      console.error("Failed to fetch market data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 120000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main data-testid="market-page" className="min-h-screen pt-24 pb-12">
      <div className="blur-blob w-[500px] h-[500px] bg-purple-600/10 -top-20 right-0" />
      <div className="blur-blob w-[400px] h-[400px] bg-[#00F0FF]/5 bottom-20 left-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-['Unbounded'] font-extrabold text-3xl sm:text-4xl text-white mb-2">
              Live <span className="text-gradient">Market</span>
            </h1>
            <p className="text-sm text-[#A1A1AA]">
              Real-time cryptocurrency prices powered by CoinGecko.
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            data-testid="refresh-market-button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-[#0F0518]/60" />
            ))
          ) : globalStats ? (
            <>
              <StatCard
                label="Total Market Cap"
                value={formatNumber(globalStats.total_market_cap)}
                change={globalStats.market_cap_change_24h}
                testId="stat-market-cap"
              />
              <StatCard
                label="24h Volume"
                value={formatNumber(globalStats.total_volume)}
                testId="stat-volume"
              />
              <StatCard
                label="BTC Dominance"
                value={`${globalStats.btc_dominance?.toFixed(1)}%`}
                testId="stat-btc-dominance"
              />
              <StatCard
                label="Active Cryptos"
                value={globalStats.active_cryptocurrencies?.toLocaleString()}
                testId="stat-active-cryptos"
              />
            </>
          ) : null}
        </motion.div>

        {/* Trending */}
        {trending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-[#FF0080]" />
              <h2 className="font-['Unbounded'] font-semibold text-lg text-white">Trending</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trending.map((coin, i) => (
                <div
                  key={coin.id || i}
                  data-testid={`trending-coin-${i}`}
                  className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F0518]/60 border border-white/[0.06] hover:border-purple-500/20 transition-colors"
                >
                  {coin.thumb && (
                    <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-sm text-white font-medium">{coin.name}</span>
                  <Badge variant="secondary" className="text-xs bg-white/5 text-[#A1A1AA] border-0">
                    #{coin.market_cap_rank || "N/A"}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Coins Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-[#0F0518]/40 border border-white/[0.06] backdrop-blur-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 p-5 border-b border-white/[0.04]">
            <BarChart3 className="w-5 h-5 text-[#7F00FF]" />
            <h2 className="font-['Unbounded'] font-semibold text-lg text-white">Top Cryptocurrencies</h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.04] hover:bg-transparent">
                  <TableHead className="text-[#52525B] font-semibold text-xs w-12">#</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs">Coin</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs text-right">Price</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs text-right">24h %</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs text-right hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs text-right hidden lg:table-cell">Volume</TableHead>
                  <TableHead className="text-[#52525B] font-semibold text-xs text-right hidden md:table-cell">7d Chart</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i} className="border-white/[0.04]">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-5 w-full bg-white/5 rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : coins.map((coin, i) => {
                      const isUp = (coin.price_change_percentage_24h || 0) >= 0;
                      return (
                        <TableRow
                          key={coin.id}
                          data-testid={`coin-row-${coin.id}`}
                          className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        >
                          <TableCell className="text-[#52525B] font-['JetBrains_Mono'] text-xs">
                            {coin.market_cap_rank || i + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {coin.image && (
                                <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                              )}
                              <div>
                                <span className="text-sm font-medium text-white">{coin.name}</span>
                                <span className="text-xs text-[#52525B] ml-2">{coin.symbol}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-['JetBrains_Mono'] text-sm text-white">
                            {formatPrice(coin.current_price)}
                          </TableCell>
                          <TableCell className={`text-right font-['JetBrains_Mono'] text-sm ${isUp ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                            <div className="flex items-center justify-end gap-1">
                              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-['JetBrains_Mono'] text-xs text-[#A1A1AA] hidden md:table-cell">
                            {formatNumber(coin.market_cap)}
                          </TableCell>
                          <TableCell className="text-right font-['JetBrains_Mono'] text-xs text-[#A1A1AA] hidden lg:table-cell">
                            {formatNumber(coin.total_volume)}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <MiniSparkline data={coin.sparkline_in_7d} isPositive={isUp} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        <div className="text-center mt-6 text-xs text-[#52525B] font-['JetBrains_Mono']">
          Data provided by CoinGecko API &middot; Auto-refreshes every 2 minutes
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}

function StatCard({ label, value, change, testId }) {
  return (
    <div data-testid={testId} className="p-4 rounded-xl bg-[#0F0518]/60 border border-white/[0.06] backdrop-blur-sm">
      <div className="text-xs text-[#52525B] mb-1">{label}</div>
      <div className="font-['JetBrains_Mono'] font-bold text-lg text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-xs font-['JetBrains_Mono'] mt-1 ${change >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
          {change >= 0 ? "+" : ""}{change?.toFixed(2)}%
        </div>
      )}
    </div>
  );
}
