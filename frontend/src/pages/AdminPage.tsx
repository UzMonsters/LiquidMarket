import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { ShieldCheck, Plus, Check, X, Users, History, BarChart3, ChevronRight } from 'lucide-react';
import { Outcome } from '../types';
import { apiAdminGetTrades, type AdminTrade } from '../lib/api';

const AdminPage = () => {
  const { markets, createMarket, closeMarket, resolveMarket } = useApp();
  const [newMarketTitle, setNewMarketTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [adminTrades, setAdminTrades] = useState<AdminTrade[]>([]);

  useEffect(() => {
    apiAdminGetTrades().then(setAdminTrades).catch(console.error);
  }, [markets]);

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMarketTitle.trim()) {
      setIsCreating(true);
      try {
        await createMarket(newMarketTitle.trim());
        setNewMarketTitle('');
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Admin <span className="text-white/40 italic serif">Dashboard</span></h2>
          <p className="text-white/60 font-light tracking-wide max-w-lg">
            Manage markets, review user activity, and resolve outcomes. 
            Full control over the Liquid Markets ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
          <ShieldCheck size={16} className="text-orange-400" />
          <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Authorized Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Market Management */}
        <div className="lg:col-span-8 space-y-12">
          {/* Create Market */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]"
          >
            <div className="flex items-center gap-2 mb-6 text-white/40">
              <Plus size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Create New Market</span>
            </div>
            <form onSubmit={handleCreateMarket} className="flex gap-4">
              <input
                type="text"
                placeholder="Market title (e.g., Will Bitcoin reach 100k?)"
                value={newMarketTitle}
                onChange={(e) => setNewMarketTitle(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-lg font-medium focus:outline-none focus:border-white/30 transition-all"
              />
              <button
                type="submit"
                disabled={isCreating || !newMarketTitle.trim()}
                className={`px-8 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 ${
                  isCreating 
                    ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-white/90 active:scale-95'
                }`}
              >
                {isCreating ? 'Creating...' : 'Create Market'}
              </button>
            </form>
          </motion.div>

          {/* Active Markets Table */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/40">
              <BarChart3 size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Manage Markets</span>
            </div>

            <div className="space-y-4">
              {markets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                        market.status === 'OPEN' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}>
                        {market.status}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">ID: {market.id}</span>
                    </div>
                    <h4 className="text-xl font-bold tracking-tight">{market.title}</h4>
                  </div>

                  <div className="flex items-center gap-4">
                    {market.status === 'OPEN' && (
                      <button
                        onClick={() => closeMarket(market.id)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                      >
                        Close Market
                      </button>
                    )}
                    {market.status === 'CLOSED' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => resolveMarket(market.id, 'YES')}
                          className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl text-sm font-bold hover:bg-green-500/30 transition-all flex items-center gap-2"
                        >
                          <Check size={16} /> Resolve YES
                        </button>
                        <button
                          onClick={() => resolveMarket(market.id, 'NO')}
                          className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <X size={16} /> Resolve NO
                        </button>
                      </div>
                    )}
                    {market.status === 'RESOLVED' && (
                      <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold text-white/60">
                        Resolved: {market.resolvedOutcome}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Trades */}
        <div className="lg:col-span-4 space-y-12">
          {/* Global Stats */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/40">
              <Users size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Platform Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Trades</div>
                <div className="text-2xl font-mono font-bold">{adminTrades.length}</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Active Markets</div>
                <div className="text-2xl font-mono font-bold">{markets.filter(m => m.status === 'OPEN').length}</div>
              </div>
            </div>
          </div>

          {/* All Trades */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/40">
              <History size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Global Trade Log</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {adminTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span className={trade.side === 'BUY' ? 'text-green-400' : 'text-red-400'}>{trade.side}</span>
                      <span className="text-white/40">by</span>
                      <span>{trade.username || `User_${trade.user_id}`}</span>
                    </div>
                    <div className="text-white/40 mt-1">
                      {trade.shares.toFixed(0)} shares of {trade.outcome}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">${trade.amount.toFixed(2)}</div>
                    <div className="text-white/20 font-mono">
                      {new Date(trade.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
