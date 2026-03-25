<?php

namespace App\Services;

use App\Models\Market;
use App\Repositories\MarketRepository;

class MarketService
{
    public function __construct(
        private MarketRepository $marketRepository,
    ) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->marketRepository->all();
    }

    public function getById(int $id): ?Market
    {
        return $this->marketRepository->findById($id);
    }

    public function create(string $title, float $liquidity = 5000): Market
    {
        return $this->marketRepository->create($title, $liquidity);
    }

    public function close(int $marketId): Market
    {
        $market = $this->marketRepository->findById($marketId);

        if (!$market || $market->status !== 'OPEN') {
            throw new \InvalidArgumentException('Market is not open.');
        }

        $this->marketRepository->close($market);
        return $market->fresh();
    }

    public function resolve(int $marketId, string $outcome): Market
    {
        $market = $this->marketRepository->findById($marketId);

        if (!$market || $market->status === 'RESOLVED') {
            throw new \InvalidArgumentException('Market cannot be resolved.');
        }

        $this->marketRepository->resolve($market, $outcome);

        // Pay out winners
        $this->payoutWinners($market->fresh(), $outcome);

        return $market->fresh();
    }

    private function payoutWinners(Market $market, string $outcome): void
    {
        $positions = $market->positions()->get();

        foreach ($positions as $position) {
            $shares = $outcome === 'YES' ? (float) $position->yes_shares : (float) $position->no_shares;
            if ($shares > 0) {
                // Each winning share is worth $1
                $payout = $shares * 1;
                $position->user->increment('balance', $payout);
            }
        }
    }
}
