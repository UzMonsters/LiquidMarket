import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Market, User, Position, Trade, Outcome, TradeSide } from './types';
import {
  apiEnter,
  apiGetMarkets,
  apiTradeExecute,
  apiAdminCreateMarket,
  apiAdminCloseMarket,
  apiAdminResolveMarket,
  apiGetPortfolio,
  apiGetTradeHistory,
  type ApiMarket,
  type PortfolioPosition,
} from './lib/api';

interface AppState {
  user: User | null;
  markets: Market[];
  positions: Position[];
  trades: Trade[];
  loading: boolean;
  login: (username: string) => Promise<void>;
  executeTrade: (marketId: string, side: TradeSide, outcome: Outcome, amount: number) => Promise<void>;
  createMarket: (title: string) => Promise<void>;
  closeMarket: (marketId: string) => Promise<void>;
  resolveMarket: (marketId: string, outcome: Outcome) => Promise<void>;
  refreshMarkets: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

function mapApiMarket(m: ApiMarket): Market {
  return {
    id: String(m.id),
    title: m.title,
    status: m.status as Market['status'],
    priceYes: m.price_yes,
    priceNo: m.price_no,
    yesTotal: m.yes_total,
    noTotal: m.no_total,
    liquidity: m.liquidity,
    volume: m.volume,
    resolvedOutcome: m.resolved_outcome as Outcome | undefined,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshMarkets = useCallback(async () => {
    try {
      const data = await apiGetMarkets();
      setMarkets(data.map(mapApiMarket));
    } catch (e) {
      console.error('Failed to load markets:', e);
    }
  }, []);

  const refreshPortfolio = useCallback(async () => {
    if (!user) return;
    try {
      const [portfolio, history] = await Promise.all([
        apiGetPortfolio(Number(user.id)),
        apiGetTradeHistory(Number(user.id)),
      ]);

      setUser(prev => prev ? { ...prev, balance: portfolio.user.balance } : prev);

      setPositions(portfolio.positions.map((p: PortfolioPosition) => ({
        userId: user.id,
        marketId: String(p.market_id),
        yesShares: p.yes_shares,
        noShares: p.no_shares,
        avgYesPrice: p.avg_yes_price,
        avgNoPrice: p.avg_no_price,
      })));

      setTrades(history.map(t => ({
        id: String(t.id),
        userId: user.id,
        marketId: String(t.market_id),
        side: t.side as TradeSide,
        outcome: t.outcome as Outcome,
        shares: t.shares,
        price: t.price,
        amount: t.amount,
        timestamp: new Date(t.created_at).getTime(),
      })));
    } catch (e) {
      console.error('Failed to load portfolio:', e);
    }
  }, [user]);

  const login = async (username: string) => {
    setLoading(true);
    try {
      const data = await apiEnter(username);
      const newUser: User = {
        id: String(data.user_id),
        username: data.username,
        balance: data.balance,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    }
  }, []);

  useEffect(() => {
    refreshMarkets();
  }, [refreshMarkets]);

  useEffect(() => {
    if (user) {
      refreshPortfolio();
    }
  }, [user, refreshPortfolio]);

  const executeTrade = async (marketId: string, side: TradeSide, outcome: Outcome, amount: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await apiTradeExecute({
        user_id: Number(user.id),
        market_id: Number(marketId),
        side,
        outcome,
        amount,
      });

      // Update user balance
      setUser(prev => prev ? { ...prev, balance: result.balance } : prev);
      localStorage.setItem('user', JSON.stringify({ ...user, balance: result.balance }));

      // Refresh data
      await Promise.all([refreshMarkets(), refreshPortfolio()]);
    } finally {
      setLoading(false);
    }
  };

  const createMarket = async (title: string) => {
    setLoading(true);
    try {
      await apiAdminCreateMarket(title);
      await refreshMarkets();
    } finally {
      setLoading(false);
    }
  };

  const closeMarket = async (marketId: string) => {
    setLoading(true);
    try {
      await apiAdminCloseMarket(Number(marketId));
      await refreshMarkets();
    } finally {
      setLoading(false);
    }
  };

  const resolveMarket = async (marketId: string, outcome: Outcome) => {
    setLoading(true);
    try {
      await apiAdminResolveMarket(Number(marketId), outcome);
      await Promise.all([refreshMarkets(), refreshPortfolio()]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      markets,
      positions,
      trades,
      loading,
      login,
      executeTrade,
      createMarket,
      closeMarket,
      resolveMarket,
      refreshMarkets,
      refreshPortfolio,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
