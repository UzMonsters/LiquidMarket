import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';

const MarketCard = ({ market, index }: any) => {
  return (
    <motion.div
      key={market.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300"
    >
      <Link to={`/markets/${market.id}`} className="block">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
              market.status === 'OPEN' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'
            }`}>
              {market.status}
            </span>
            <h3 className="text-2xl font-bold mt-4 tracking-tight group-hover:text-white transition-colors">
              {market.title}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
            <ChevronRight size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
              <TrendingUp size={12} className="text-green-400" /> YES
            </div>
            <div className="text-2xl font-mono font-bold">{(market.priceYes * 100).toFixed(0)}¢</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
              <TrendingDown size={12} className="text-red-400" /> NO
            </div>
            <div className="text-2xl font-mono font-bold">{(market.priceNo * 100).toFixed(0)}¢</div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Volume</span>
            <span className="text-sm font-mono">${market.volume.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Liquidity</span>
            <span className="text-sm font-mono">${market.liquidity.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const MarketsPage = () => {
  const { markets } = useApp();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Active <span className="text-white/40 italic serif">Markets</span></h2>
          <p className="text-white/60 font-light tracking-wide max-w-lg">
            Predict the outcome of global events. Trade on real-time probabilities 
            with deep liquidity and instant execution.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
            <Activity size={16} className="text-blue-400" />
            <span className="text-white/60">Live Feed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((market, index) => (
          <MarketCard key={market.id} market={market} index={index} />
        ))}
      </div>
    </div>
  );
};

export default MarketsPage;
