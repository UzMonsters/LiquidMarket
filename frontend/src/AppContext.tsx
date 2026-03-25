import React, { createContext, useContext, useState, useEffect } from 'react';
import { Market, User, Position, Trade, Outcome, TradeSide } from './types';

interface AppState {
  user: User | null;
  markets: Market[];
  positions: Position[];
  trades: Trade[];
  login: (username: string) => void;
  executeTrade: (marketId: string, side: TradeSide, outcome: Outcome, amount: number) => void;
  createMarket: (title: string) => void;
  closeMarket: (marketId: string) => void;
  resolveMarket: (marketId: string, outcome: Outcome) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    title: 'Bitcoin > 100k by end of month',
    status: 'OPEN',
    priceYes: 0.62,
    priceNo: 0.38,
    yesTotal: 1000,
    noTotal: 600,
    liquidity: 5000,
    volume: 12000,
  },
  {
    id: '2',
    title: 'Ethereum > 5k by end of month',
    status: 'OPEN',
    priceYes: 0.45,
    priceNo: 0.55,
    yesTotal: 800,
    noTotal: 1000,
    liquidity: 4000,
    volume: 8500,
  },
  {
    id: '3',
    title: 'Solana > 250 by end of month',
    status: 'OPEN',
    priceYes: 0.75,
    priceNo: 0.25,
    yesTotal: 1500,
    noTotal: 500,
    liquidity: 6000,
    volume: 15000,
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  const login = (username: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      balance: 100000,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const calculatePrice = (market: Market) => {
    const priceYes = 0.5 + (market.yesTotal - market.noTotal) / (2 * market.liquidity);
    const clampedYes = Math.max(0.01, Math.min(0.99, priceYes));
    return {
      priceYes: parseFloat(clampedYes.toFixed(2)),
      priceNo: parseFloat((1 - clampedYes).toFixed(2))
    };
  };

  const executeTrade = (marketId: string, side: TradeSide, outcome: Outcome, amount: number) => {
    if (!user) return;

    const marketIndex = markets.findIndex(m => m.id === marketId);
    if (marketIndex === -1) return;

    const market = markets[marketIndex];
    const price = outcome === 'YES' ? market.priceYes : market.priceNo;
    const shares = amount / price;

    if (side === 'BUY') {
      if (user.balance < amount) return;

      // Update User
      const updatedUser = { ...user, balance: user.balance - amount };
      setUser(updatedUser);

      // Update Market
      const updatedMarket = { ...market };
      if (outcome === 'YES') updatedMarket.yesTotal += shares;
      else updatedMarket.noTotal += shares;
      
      const newPrices = calculatePrice(updatedMarket);
      updatedMarket.priceYes = newPrices.priceYes;
      updatedMarket.priceNo = newPrices.priceNo;
      updatedMarket.volume += amount;

      const newMarkets = [...markets];
      newMarkets[marketIndex] = updatedMarket;
      setMarkets(newMarkets);

      // Update Position
      const posIndex = positions.findIndex(p => p.marketId === marketId && p.userId === user.id);
      const newPositions = [...positions];
      if (posIndex === -1) {
        newPositions.push({
          userId: user.id,
          marketId,
          yesShares: outcome === 'YES' ? shares : 0,
          noShares: outcome === 'NO' ? shares : 0,
          avgYesPrice: outcome === 'YES' ? price : 0,
          avgNoPrice: outcome === 'NO' ? price : 0,
        });
      } else {
        const pos = { ...newPositions[posIndex] };
        if (outcome === 'YES') {
          const totalCost = (pos.yesShares * pos.avgYesPrice) + amount;
          pos.yesShares += shares;
          pos.avgYesPrice = totalCost / pos.yesShares;
        } else {
          const totalCost = (pos.noShares * pos.avgNoPrice) + amount;
          pos.noShares += shares;
          pos.avgNoPrice = totalCost / pos.noShares;
        }
        newPositions[posIndex] = pos;
      }
      setPositions(newPositions);

      // Add Trade
      setTrades([{
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        marketId,
        side,
        outcome,
        shares,
        price,
        amount,
        timestamp: Date.now(),
      }, ...trades]);

    } else {
      // SELL Logic
      const posIndex = positions.findIndex(p => p.marketId === marketId && p.userId === user.id);
      if (posIndex === -1) return;
      const pos = positions[posIndex];
      const availableShares = outcome === 'YES' ? pos.yesShares : pos.noShares;
      
      // For simplicity in this mock, we sell all or a fixed portion
      // Let's assume amount here is shares for SELL
      const sellShares = Math.min(shares, availableShares);
      const sellAmount = sellShares * price;

      // Update User
      const updatedUser = { ...user, balance: user.balance + sellAmount };
      setUser(updatedUser);

      // Update Market
      const updatedMarket = { ...market };
      if (outcome === 'YES') updatedMarket.yesTotal -= sellShares;
      else updatedMarket.noTotal -= sellShares;
      
      const newPrices = calculatePrice(updatedMarket);
      updatedMarket.priceYes = newPrices.priceYes;
      updatedMarket.priceNo = newPrices.priceNo;
      updatedMarket.volume += sellAmount;

      const newMarkets = [...markets];
      newMarkets[marketIndex] = updatedMarket;
      setMarkets(newMarkets);

      // Update Position
      const newPositions = [...positions];
      const updatedPos = { ...pos };
      if (outcome === 'YES') updatedPos.yesShares -= sellShares;
      else updatedPos.noShares -= sellShares;
      newPositions[posIndex] = updatedPos;
      setPositions(newPositions);

      // Add Trade
      setTrades([{
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        marketId,
        side,
        outcome,
        shares: sellShares,
        price,
        amount: sellAmount,
        timestamp: Date.now(),
      }, ...trades]);
    }
  };

  const createMarket = (title: string) => {
    const newMarket: Market = {
      id: (markets.length + 1).toString(),
      title,
      status: 'OPEN',
      priceYes: 0.5,
      priceNo: 0.5,
      yesTotal: 0,
      noTotal: 0,
      liquidity: 5000,
      volume: 0,
    };
    setMarkets([...markets, newMarket]);
  };

  const closeMarket = (marketId: string) => {
    setMarkets(markets.map(m => m.id === marketId ? { ...m, status: 'CLOSED' } : m));
  };

  const resolveMarket = (marketId: string, outcome: Outcome) => {
    setMarkets(markets.map(m => m.id === marketId ? { 
      ...m, 
      status: 'RESOLVED', 
      resolvedOutcome: outcome,
      priceYes: outcome === 'YES' ? 1 : 0,
      priceNo: outcome === 'NO' ? 1 : 0
    } : m));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      markets, 
      positions, 
      trades, 
      login, 
      executeTrade, 
      createMarket, 
      closeMarket, 
      resolveMarket 
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
