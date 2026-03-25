export type MarketStatus = 'OPEN' | 'CLOSED' | 'RESOLVED';
export type Outcome = 'YES' | 'NO';
export type TradeSide = 'BUY' | 'SELL';

export interface User {
  id: string;
  username: string;
  balance: number;
}

export interface Market {
  id: string;
  title: string;
  status: MarketStatus;
  priceYes: number;
  priceNo: number;
  yesTotal: number;
  noTotal: number;
  liquidity: number;
  volume: number;
  resolvedOutcome?: Outcome;
}

export interface Position {
  userId: string;
  marketId: string;
  yesShares: number;
  noShares: number;
  avgYesPrice: number;
  avgNoPrice: number;
}

export interface Trade {
  id: string;
  userId: string;
  marketId: string;
  side: TradeSide;
  outcome: Outcome;
  shares: number;
  price: number;
  amount: number;
  timestamp: number;
}

export interface UserStats {
  userId: string;
  totalVolume: number;
  totalProfit: number;
  totalTrades: number;
}

export interface MarketStats {
  marketId: string;
  totalVolume: number;
  totalTrades: number;
  uniqueUsers: number;
}
