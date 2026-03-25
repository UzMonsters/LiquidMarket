import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { Wallet, TrendingUp, TrendingDown, History, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioPage = () => {
  const { user, positions, markets, trades } = useApp();

  if (!user) return null;

  const activePositions = positions.filter(p => p.yesShares > 0 || p.noShares > 0);

  const totalPnL = activePositions.reduce((acc, pos) => {
    const market = markets.find(m => m.id === pos.marketId);
    if (!market) return acc;
    const pnl = (market.priceYes - pos.avgYesPrice) * pos.yesShares + 
                (market.priceNo - pos.avgNoPrice) * pos.noShares;
    return acc + pnl;
  }, 0);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Your <span className="text-white/40 italic serif">Portfolio</span></h2>
          <p className="text-white/60 font-light tracking-wide max-w-lg">
            Monitor your active positions, track your performance, and review your 
            trading history.
          </p>
        </div>
        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] min-w-[300px]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
            <Wallet size={14} /> Total Balance
          </div>
          <div className="text-4xl font-mono font-bold">${user.balance.toLocaleString()}</div>
          <div className={`text-sm font-mono mt-2 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} Total PnL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Positions */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-2 text-white/40">
            <BarChart3 size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Active Positions</span>
          </div>

          <div className="space-y-4">
            {activePositions.length === 0 ? (
              <div className="p-12 bg-white/5 border border-dashed border-white/10 rounded-[32px] text-center">
                <p className="text-white/20 font-medium">No active positions found.</p>
                <Link to="/markets" className="text-white/60 hover:text-white underline text-sm mt-4 inline-block">Explore Markets</Link>
              </div>
            ) : (
              activePositions.map((pos, index) => {
                const market = markets.find(m => m.id === pos.marketId);
                if (!market) return null;
                const pnl = (market.priceYes - pos.avgYesPrice) * pos.yesShares + 
                            (market.priceNo - pos.avgNoPrice) * pos.noShares;
                
                return (
                  <motion.div
                    key={pos.marketId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Link to={`/markets/${market.id}`} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold tracking-tight mb-2 group-hover:text-white transition-colors">{market.title}</h4>
                        <div className="flex gap-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                            {pos.yesShares > 0 ? `${pos.yesShares.toFixed(0)} YES` : `${pos.noShares.toFixed(0)} NO`}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                            Avg: {(pos.yesShares > 0 ? pos.avgYesPrice : pos.avgNoPrice).toFixed(2)}¢
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Current Price</span>
                          <span className="text-lg font-mono font-bold">
                            {(pos.yesShares > 0 ? market.priceYes : market.priceNo).toFixed(2)}¢
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">PnL</span>
                          <span className={`text-lg font-mono font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                          </span>
                        </div>
                        <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Trade History */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-2 text-white/40">
            <History size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Recent Activity</span>
          </div>

          <div className="space-y-4">
            {trades.length === 0 ? (
              <div className="p-12 bg-white/5 border border-dashed border-white/10 rounded-[32px] text-center">
                <p className="text-white/20 font-medium text-sm">No trades yet.</p>
              </div>
            ) : (
              trades.slice(0, 10).map((trade, index) => {
                const market = markets.find(m => m.id === trade.marketId);
                return (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        trade.side === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {trade.side === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-tight truncate max-w-[150px]">{market?.title}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                          {trade.side} {trade.outcome} • {trade.shares.toFixed(0)} shares
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold">${trade.amount.toFixed(2)}</div>
                      <div className="text-[10px] text-white/20 font-mono">
                        {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
