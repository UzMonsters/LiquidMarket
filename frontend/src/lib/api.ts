const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Auth
export const apiEnter = (username: string) =>
  request<{ user_id: number; username: string; balance: number }>('/enter', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });

// Markets
export const apiGetMarkets = () =>
  request<ApiMarket[]>('/markets');

export const apiGetMarket = (id: number) =>
  request<ApiMarket>(`/markets/${id}`);

// Trading
export const apiTradeQuote = (data: TradeRequest) =>
  request<QuoteResponse>('/trades/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiTradeExecute = (data: TradeRequest) =>
  request<ExecuteResponse>('/trades/execute', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Portfolio
export const apiGetPortfolio = (userId: number) =>
  request<PortfolioResponse>(`/portfolio?user_id=${userId}`);

export const apiGetTradeHistory = (userId: number) =>
  request<ApiTrade[]>(`/trades/history?user_id=${userId}`);

// Admin
export const apiAdminCreateMarket = (title: string, liquidity?: number) =>
  request<ApiMarket>('/admin/markets', {
    method: 'POST',
    body: JSON.stringify({ title, liquidity }),
  });

export const apiAdminCloseMarket = (id: number) =>
  request<ApiMarket>(`/admin/markets/${id}/close`, { method: 'POST' });

export const apiAdminResolveMarket = (id: number, outcome: string) =>
  request<ApiMarket>(`/admin/markets/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ outcome }),
  });

export const apiAdminGetUsers = () =>
  request<AdminUser[]>('/admin/users');

export const apiAdminGetTrades = () =>
  request<AdminTrade[]>('/admin/trades');

// Types
export interface ApiMarket {
  id: number;
  title: string;
  status: string;
  price_yes: number;
  price_no: number;
  yes_total: number;
  no_total: number;
  liquidity: number;
  volume: number;
  resolved_outcome: string | null;
  created_at: string;
}

export interface TradeRequest {
  user_id: number;
  market_id: number;
  side: string;
  outcome: string;
  amount: number;
}

export interface QuoteResponse {
  side: string;
  outcome: string;
  shares: number;
  price: number;
  amount: number;
  fee: number;
  total_cost?: number;
  net_amount?: number;
  balance_after: number;
  can_execute: boolean;
}

export interface ExecuteResponse {
  trade: {
    id: number;
    user_id: number;
    market_id: number;
    side: string;
    outcome: string;
    shares: number;
    price: number;
    amount: number;
    created_at: string;
  };
  market: {
    id: number;
    price_yes: number;
    price_no: number;
    yes_total: number;
    no_total: number;
    volume: number;
  };
  balance: number;
}

export interface ApiTrade {
  id: number;
  market_id: number;
  market_title: string | null;
  side: string;
  outcome: string;
  shares: number;
  price: number;
  amount: number;
  created_at: string;
}

export interface PortfolioResponse {
  user: {
    id: number;
    username: string;
    balance: number;
  };
  positions: PortfolioPosition[];
}

export interface PortfolioPosition {
  market_id: number;
  market_title: string;
  market_status: string;
  yes_shares: number;
  no_shares: number;
  avg_yes_price: number;
  avg_no_price: number;
  yes_pnl: number;
  no_pnl: number;
  total_pnl: number;
}

export interface AdminUser {
  id: number;
  username: string;
  balance: number;
  total_volume: number;
  total_profit: number;
  total_trades: number;
}

export interface AdminTrade {
  id: number;
  user_id: number;
  username: string | null;
  market_id: number;
  market_title: string | null;
  side: string;
  outcome: string;
  shares: number;
  price: number;
  amount: number;
  created_at: string;
}
