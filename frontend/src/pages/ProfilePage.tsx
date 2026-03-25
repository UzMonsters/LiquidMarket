import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { User, TrendingUp, TrendingDown, Clock, DollarSign, Target, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, trades, positions, markets } = useApp();

  if (!user) return null;

  const userTrades = trades.filter(t => t.userId === user.id);
  const userPositions = positions.filter(p => p.userId === user.id);

  const totalInvested = userPositions.reduce((acc, pos) => {
    return acc + (pos.yesShares * pos.avgYesPrice) + (pos.noShares * pos.avgNoPrice);
  }, 0);

  const buyTrades = userTrades.filter(t => t.side === 'BUY');
  const sellTrades = userTrades.filter(t => t.side === 'SELL');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">
            <span className="text-white/40 italic">Your</span> Profile
          </h2>
          <p className="text-white/60 font-light tracking-wide max-w-lg">
            Manage your account settings and view your trading statistics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-4xl font-bold mb-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold">{user.username}</h3>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">
                Active Trader
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-green-400" />
                  <span className="text-white/60 text-sm">Balance</span>
                </div>
                <span className="font-mono font-bold">${user.balance.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-blue-400" />
                  <span className="text-white/60 text-sm">Invested</span>
                </div>
                <span className="font-mono font-bold">${totalInvested.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-purple-400" />
                  <span className="text-white/60 text-sm">Member Since</span>
                </div>
                <span className="font-mono font-bold text-sm">Today</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 py-4 px-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 font-bold flex items-center justify-center gap-2 transition-all duration-300"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </motion.div>
        </div>

        {/* Stats & Activity */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Total Trades</div>
              <div className="text-3xl font-bold">{userTrades.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Buy Orders</div>
              <div className="text-3xl font-bold text-green-400">{buyTrades.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Sell Orders</div>
              <div className="text-3xl font-bold text-red-400">{sellTrades.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Positions</div>
              <div className="text-3xl font-bold">{userPositions.length}</div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/40">
              <Clock size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Recent Activity</span>
            </div>

            {userTrades.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] text-center"
              >
                <div className="text-white/40 mb-2">No trades yet</div>
                <p className="text-sm text-white/30">Start trading to see your activity here</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {userTrades.slice(0, 5).map((trade, index) => {
                  const market = markets.find(m => m.id === trade.marketId);
                  return (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          trade.side === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {trade.side === 'BUY' ? (
                            <TrendingUp size={18} className="text-green-400" />
                          ) : (
                            <TrendingDown size={18} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{market?.title.slice(0, 30)}...</div>
                          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                            {trade.side} {trade.outcome} @ ${trade.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold ${trade.side === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.side === 'BUY' ? '-' : '+'}${trade.amount.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {trade.shares.toFixed(2)} shares
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
