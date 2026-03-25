import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, TrendingUp, User, ShieldCheck, Users } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import LandingPage from './pages/LandingPage';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';

const Navigation = () => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/markets', icon: TrendingUp, label: 'Markets' },
    { path: '/portfolio', icon: LayoutDashboard, label: 'Portfolio' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/admin', icon: ShieldCheck, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/markets' && location.pathname.startsWith('/markets/'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Header = () => {
  const { user } = useApp();
  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
      <Link to="/markets" className="text-xl font-bold tracking-tighter text-white pointer-events-auto">
        LIQUID <span className="text-white/40">MARKETS</span>
      </Link>
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Balance</span>
          <span className="text-lg font-mono text-white">${user.balance.toLocaleString()}</span>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
          <User size={20} />
        </Link>
      </div>
    </header>
  );
};

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Animated Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]"
      />
      
      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useApp();
  const location = useLocation();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-white selection:text-black overflow-hidden">
      <Background />
      <Header />
      <Navigation />

      <main className={user ? "pt-32 pb-32 px-8 max-w-7xl mx-auto" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/markets" />} />
            <Route path="/markets" element={user ? <MarketsPage /> : <Navigate to="/" />} />
            <Route path="/markets/:id" element={user ? <MarketDetailPage /> : <Navigate to="/" />} />
            <Route path="/portfolio" element={user ? <PortfolioPage /> : <Navigate to="/" />} />
            <Route path="/users" element={user ? <UsersPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
