import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { Users, Trophy, TrendingUp, Medal, Crown, Star } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { id: '1', username: 'whale_trader', balance: 523400, winRate: 78, trades: 156 },
  { id: '2', username: 'crypto_king', balance: 412300, winRate: 72, trades: 203 },
  { id: '3', username: 'diamond_hands', balance: 389100, winRate: 69, trades: 89 },
  { id: '4', username: 'moon_boy', balance: 245600, winRate: 65, trades: 134 },
  { id: '5', username: 'degen_master', balance: 198400, winRate: 61, trades: 312 },
  { id: '6', username: 'smart_money', balance: 167800, winRate: 58, trades: 67 },
  { id: '7', username: 'risk_taker', balance: 145200, winRate: 55, trades: 245 },
  { id: '8', username: 'steady_wins', balance: 134500, winRate: 52, trades: 178 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown size={18} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={18} className="text-gray-300" />;
  if (rank === 3) return <Medal size={18} className="text-amber-600" />;
  return <span className="text-white/40 font-mono text-sm">#{rank}</span>;
};

const UsersPage = () => {
  const { user, trades } = useApp();

  if (!user) return null;

  const userTrades = trades.filter(t => t.userId === user.id);
  const userRank = MOCK_LEADERBOARD.findIndex(u => u.balance < user.balance) + 1 || MOCK_LEADERBOARD.length + 1;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">
            <span className="text-white/40 italic">Community</span> Traders
          </h2>
          <p className="text-white/60 font-light tracking-wide max-w-lg">
            See how you stack up against other traders. Climb the leaderboard
            by making smart predictions.
          </p>
        </div>
        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] min-w-[300px]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
            <Star size={14} /> Your Ranking
          </div>
          <div className="text-4xl font-mono font-bold">#{userRank}</div>
          <div className="text-sm text-white/40 mt-2">
            {userTrades.length} trades completed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Leaderboard */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-2 text-white/40">
            <Trophy size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Top Traders</span>
          </div>

          <div className="space-y-4">
            {MOCK_LEADERBOARD.map((trader, index) => (
              <motion.div
                key={trader.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 backdrop-blur-xl border rounded-[32px] transition-all duration-300 ${
                  index < 3
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold tracking-tight">{trader.username}</h4>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        {trader.trades} trades
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Win Rate</span>
                      <span className="text-lg font-mono font-bold text-green-400">{trader.winRate}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Balance</span>
                      <span className="text-lg font-mono font-bold">${trader.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-2 text-white/40">
            <Users size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Your Profile</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Rank #{userRank}
                </span>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Balance</span>
                <span className="font-mono font-bold">${user.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Total Trades</span>
                <span className="font-mono font-bold">{userTrades.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Member Since</span>
                <span className="font-mono font-bold text-sm">Today</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[32px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={20} className="text-green-400" />
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Pro Tip</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Diversify your positions across multiple markets to reduce risk and climb the leaderboard faster.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
