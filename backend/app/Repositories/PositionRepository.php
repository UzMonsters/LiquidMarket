<?php

namespace App\Repositories;

use App\Models\Position;

class PositionRepository
{
    public function findOrCreate(int $userId, int $marketId): Position
    {
        return Position::firstOrCreate(
            ['user_id' => $userId, 'market_id' => $marketId],
            ['yes_shares' => 0, 'no_shares' => 0, 'avg_yes_price' => 0, 'avg_no_price' => 0]
        );
    }

    public function getByUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Position::where('user_id', $userId)
            ->with('market')
            ->where(function ($q) {
                $q->where('yes_shares', '>', 0)->orWhere('no_shares', '>', 0);
            })
            ->get();
    }

    public function addShares(Position $position, string $outcome, float $shares, float $price): void
    {
        if ($outcome === 'YES') {
            $totalCost = ($position->yes_shares * $position->avg_yes_price) + ($shares * $price);
            $newShares = $position->yes_shares + $shares;
            $position->update([
                'yes_shares' => $newShares,
                'avg_yes_price' => $newShares > 0 ? $totalCost / $newShares : 0,
            ]);
        } else {
            $totalCost = ($position->no_shares * $position->avg_no_price) + ($shares * $price);
            $newShares = $position->no_shares + $shares;
            $position->update([
                'no_shares' => $newShares,
                'avg_no_price' => $newShares > 0 ? $totalCost / $newShares : 0,
            ]);
        }
    }

    public function removeShares(Position $position, string $outcome, float $shares): void
    {
        if ($outcome === 'YES') {
            $position->update([
                'yes_shares' => max(0, $position->yes_shares - $shares),
            ]);
        } else {
            $position->update([
                'no_shares' => max(0, $position->no_shares - $shares),
            ]);
        }
    }

    public function getAvailableShares(Position $position, string $outcome): float
    {
        return $outcome === 'YES' ? (float) $position->yes_shares : (float) $position->no_shares;
    }
}
