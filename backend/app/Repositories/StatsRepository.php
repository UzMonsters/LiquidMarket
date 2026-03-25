<?php

namespace App\Repositories;

use App\Models\MarketStat;
use App\Models\UserStat;

class StatsRepository
{
    public function updateUserStats(int $userId, float $amount): void
    {
        $stat = UserStat::firstOrCreate(['user_id' => $userId]);
        $stat->increment('total_volume', $amount);
        $stat->increment('total_trades');
    }

    public function updateUserProfit(int $userId, float $profit): void
    {
        $stat = UserStat::firstOrCreate(['user_id' => $userId]);
        $stat->increment('total_profit', $profit);
    }

    public function updateMarketStats(int $marketId, int $userId, float $amount): void
    {
        $stat = MarketStat::firstOrCreate(['market_id' => $marketId]);
        $stat->increment('total_volume', $amount);
        $stat->increment('total_trades');

        $uniqueUsers = \App\Models\Trade::where('market_id', $marketId)
            ->distinct('user_id')
            ->count('user_id');
        $stat->update(['unique_users' => $uniqueUsers]);
    }

    public function getUserStats(int $userId): ?UserStat
    {
        return UserStat::where('user_id', $userId)->first();
    }

    public function getMarketStats(int $marketId): ?MarketStat
    {
        return MarketStat::where('market_id', $marketId)->first();
    }
}
