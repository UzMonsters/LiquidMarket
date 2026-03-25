<?php

namespace App\Repositories;

use App\Models\Trade;

class TradeRepository
{
    public function create(array $data): Trade
    {
        return Trade::create($data);
    }

    public function getByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Trade::where('user_id', $userId)
            ->with('market')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getByMarket(int $marketId): \Illuminate\Database\Eloquent\Collection
    {
        return Trade::where('market_id', $marketId)
            ->with('user')
            ->orderByDesc('created_at')
            ->get();
    }

    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return Trade::with(['user', 'market'])
            ->orderByDesc('created_at')
            ->get();
    }
}
