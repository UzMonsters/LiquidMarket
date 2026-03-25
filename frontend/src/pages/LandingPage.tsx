import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await login(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-screen h-screen object-cover -z-10"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 w-screen h-screen bg-black/70 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl px-4"
      >
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          Elevate Your <br />
          <span className="text-white/50 italic">Trading Experience</span>
        </h1>
        <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto font-light tracking-wide">
          Unlock your trading potential in a fully decentralized environment,
          powered by Liquid Markets.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group mb-12">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all duration-300 backdrop-blur-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-white/90 transition-all duration-300 active:scale-95"
          >
            Enter <ArrowRight size={18} />
          </button>
        </form>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm text-white/70">Instant Execution</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <Shield size={16} className="text-green-400" />
            <span className="text-sm text-white/70">Fully Decentralized</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <TrendingUp size={16} className="text-blue-400" />
            <span className="text-sm text-white/70">Real-time Markets</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl hidden md:block"
        >
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Active Markets</div>
          <div className="text-2xl font-bold">50+</div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[5%] p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl hidden md:block"
        >
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Success Rate</div>
          <div className="text-2xl font-bold">96%</div>
          <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '96%' }}
              transition={{ duration: 2, delay: 1.5 }}
              className="h-full bg-white"
            />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -2, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[25%] right-[8%] p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl hidden md:block"
        >
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Volume</div>
          <div className="text-2xl font-bold">$2.4M</div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
