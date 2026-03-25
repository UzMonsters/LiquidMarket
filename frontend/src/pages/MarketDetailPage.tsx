import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { ArrowLeft, TrendingUp, TrendingDown, Info, ShoppingCart, BarChart3, Wallet, ChevronRight } from 'lucide-react';
import { Outcome, TradeSide } from '../types';

const MarketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markets, user, positions, executeTrade } = useApp();
  
  const market = markets.find(m => m.id === id);
  const position = positions.find(p => p.marketId === id && p.userId === user?.id);

  const [side, setSide] = useState<TradeSide>('BUY');
  const [outcome, setOutcome] = useState<Outcome>('YES');
  const [amount, setAmount] = useState<string>('100');
  const [isExecuting, setIsExecuting] = useState(false);

  if (!market) return <div>Market not found</div>;

  const currentPrice = outcome === 'YES' ? market.priceYes : market.priceNo;
  const shares = parseFloat(amount) / currentPrice || 0;
  const fee = parseFloat(amount) * 0.01;
  const totalAmount = parseFloat(amount) + fee;

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      executeTrade(market.id, side, outcome, parseFloat(amount));
      setIsExecuting(false);
    }, 1000);
  };

  const pnl = position 
    ? (market.priceYes - position.avgYesPrice) * position.yesShares + 
      (market.priceNo - position.avgNoPrice) * position.noShares
    : 0;

  return (
    <div className="space-y-12">
      <button 
        onClick={() => navigate('/markets')}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium uppercase tracking-widest">Back to Markets</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Info & Price */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                market.status === 'OPEN' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'
              }`}>
                {market.status}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Market ID: {market.id}</span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9] mb-8">
              {market.title}
            </h1>
          </motion.div>

          {/* Price Chart Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden relative"
          >
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Current Probability</div>
                <div className="text-7xl font-mono font-bold">{(market.priceYes * 100).toFixed(0)}%</div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">YES</span>
                  <span className="text-2xl font-mono font-bold text-green-400">{(market.priceYes * 100).toFixed(0)}¢</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">NO</span>
                  <span className="text-2xl font-mono font-bold text-red-400">{(market.priceNo * 100).toFixed(0)}¢</span>
                </div>
              </div>
            </div>
            
            {/* Simple SVG Chart Simulation */}
            <div className="h-48 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M0,80 Q25,70 40,85 T70,60 T100,75"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  d="M0,50 Q30,40 50,60 T80,30 T100,45"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Position Info */}
          {position && (position.yesShares > 0 || position.noShares > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]"
            >
              <div className="flex items-center gap-2 mb-6 text-white/40">
                <BarChart3 size={18} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Your Position</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Shares</div>
                  <div className="text-2xl font-mono font-bold">
                    {position.yesShares > 0 ? `${position.yesShares.toFixed(0)} YES` : `${position.noShares.toFixed(0)} NO`}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Avg Price</div>
                  <div className="text-2xl font-mono font-bold">
                    {(position.yesShares > 0 ? position.avgYesPrice : position.avgNoPrice).toFixed(2)}¢
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">PnL</div>
                  <div className={`text-2xl font-mono font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Trading Interface */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="sticky top-32 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-8 text-white/40">
              <ShoppingCart size={18} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Trade Interface</span>
            </div>

            {/* Buy/Sell Toggle */}
            <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
              {['BUY', 'SELL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s as TradeSide)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    side === s ? 'bg-white text-black' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Outcome Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setOutcome('YES')}
                className={`flex-1 p-6 rounded-3xl border transition-all duration-300 ${
                  outcome === 'YES' 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold mb-1">Outcome</div>
                <div className="text-2xl font-bold">YES</div>
                <div className="text-sm font-mono mt-1">{(market.priceYes * 100).toFixed(0)}¢</div>
              </button>
              <button
                onClick={() => setOutcome('NO')}
                className={`flex-1 p-6 rounded-3xl border transition-all duration-300 ${
                  outcome === 'NO' 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold mb-1">Outcome</div>
                <div className="text-2xl font-bold">NO</div>
                <div className="text-sm font-mono mt-1">{(market.priceNo * 100).toFixed(0)}¢</div>
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Amount</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Balance: ${user?.balance.toLocaleString()}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-3xl font-mono font-bold focus:outline-none focus:border-white/30 transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
              </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Estimated Shares</span>
                <span className="font-mono font-bold">{shares.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Avg Price</span>
                <span className="font-mono font-bold">{currentPrice.toFixed(2)}¢</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Trading Fee (1%)</span>
                <span className="font-mono font-bold">${fee.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between">
                <span className="font-bold">Total Cost</span>
                <span className="font-mono font-bold text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting || !amount || parseFloat(amount) <= 0}
              className={`w-full py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                isExecuting 
                  ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-white/90 active:scale-95'
              }`}
            >
              {isExecuting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full"
                />
              ) : (
                <>Execute {side} <ChevronRight size={20} /></>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailPage;
