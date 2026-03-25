<?php

namespace App\Repositories;

use App\Models\Market;
use App\Models\MarketStat;

class MarketRepository
{
    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return Market::orderByDesc('created_at')->get();
    }

    public function findById(int $id): ?Market
    {
        return Market::find($id);
    }

    public function create(string $title, float $liquidity = 5000): Market
    {
        $market = Market::create([
            'title' => $title,
            'status' => 'OPEN',
            'price_yes' => 0.5,
            'price_no' => 0.5,
            'yes_total' => 0,
            'no_total' => 0,
            'liquidity' => $liquidity,
            'volume' => 0,
        ]);

        MarketStat::create(['market_id' => $market->id]);

        return $market;
    }

    public function updatePrices(Market $market): void
    {
        $priceYes = 0.5 + ($market->yes_total - $market->no_total) / (2 * $market->liquidity);
        $priceYes = max(0.01, min(0.99, $priceYes));
        $priceNo = 1 - $priceYes;

        $market->update([
            'price_yes' => round($priceYes, 4),
            'price_no' => round($priceNo, 4),
        ]);
    }

    public function close(Market $market): void
    {
        $market->update(['status' => 'CLOSED']);
    }

    public function resolve(Market $market, string $outcome): void
    {
        $market->update([
            'status' => 'RESOLVED',
            'resolved_outcome' => $outcome,
            'price_yes' => $outcome === 'YES' ? 1 : 0,
            'price_no' => $outcome === 'NO' ? 1 : 0,
        ]);
    }

    public function addVolume(Market $market, float $amount): void
    {
        $market->increment('volume', $amount);
    }

    public function addShares(Market $market, string $outcome, float $shares): void
    {
        if ($outcome === 'YES') {
            $market->increment('yes_total', $shares);
        } else {
            $market->increment('no_total', $shares);
        }
    }

    public function removeShares(Market $market, string $outcome, float $shares): void
    {
        if ($outcome === 'YES') {
            $market->decrement('yes_total', $shares);
        } else {
            $market->decrement('no_total', $shares);
        }
    }
}
