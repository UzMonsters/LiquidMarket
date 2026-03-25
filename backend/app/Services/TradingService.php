<?php

namespace App\Services;

use App\Models\Trade;
use App\Models\User;
use App\Repositories\MarketRepository;
use App\Repositories\PositionRepository;
use App\Repositories\StatsRepository;
use App\Repositories\TradeRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;

class TradingService
{
    public function __construct(
        private UserRepository $userRepository,
        private MarketRepository $marketRepository,
        private PositionRepository $positionRepository,
        private TradeRepository $tradeRepository,
        private StatsRepository $statsRepository,
    ) {}

    /**
     * Preview a trade without executing it.
     */
    public function quote(int $userId, int $marketId, string $side, string $outcome, float $amount): array
    {
        $user = $this->userRepository->findById($userId);
        $market = $this->marketRepository->findById($marketId);

        if (!$user || !$market || $market->status !== 'OPEN') {
            throw new \InvalidArgumentException('Invalid user or market.');
        }

        $price = $outcome === 'YES' ? (float) $market->price_yes : (float) $market->price_no;

        if ($side === 'BUY') {
            $shares = $amount / $price;
            $fee = $amount * 0.01;
            $totalCost = $amount + $fee;

            return [
                'side' => $side,
                'outcome' => $outcome,
                'shares' => round($shares, 4),
                'price' => round($price, 4),
                'amount' => round($amount, 2),
                'fee' => round($fee, 2),
                'total_cost' => round($totalCost, 2),
                'balance_after' => round($user->balance - $totalCost, 2),
                'can_execute' => $user->balance >= $totalCost,
            ];
        }

        // SELL
        $position = $this->positionRepository->findOrCreate($userId, $marketId);
        $availableShares = $this->positionRepository->getAvailableShares($position, $outcome);
        $shares = $amount / $price;
        $sellShares = min($shares, $availableShares);
        $sellAmount = $sellShares * $price;
        $fee = $sellAmount * 0.01;
        $netAmount = $sellAmount - $fee;

        return [
            'side' => $side,
            'outcome' => $outcome,
            'shares' => round($sellShares, 4),
            'price' => round($price, 4),
            'amount' => round($sellAmount, 2),
            'fee' => round($fee, 2),
            'net_amount' => round($netAmount, 2),
            'balance_after' => round($user->balance + $netAmount, 2),
            'can_execute' => $sellShares > 0,
        ];
    }

    /**
     * Execute a trade.
     */
    public function execute(int $userId, int $marketId, string $side, string $outcome, float $amount): Trade
    {
        return DB::transaction(function () use ($userId, $marketId, $side, $outcome, $amount) {
            $user = User::lockForUpdate()->find($userId);
            $market = \App\Models\Market::lockForUpdate()->find($marketId);

            if (!$user || !$market || $market->status !== 'OPEN') {
                throw new \InvalidArgumentException('Invalid user or market.');
            }

            $price = $outcome === 'YES' ? (float) $market->price_yes : (float) $market->price_no;

            if ($side === 'BUY') {
                return $this->executeBuy($user, $market, $outcome, $price, $amount);
            }

            return $this->executeSell($user, $market, $outcome, $price, $amount);
        });
    }

    private function executeBuy($user, $market, string $outcome, float $price, float $amount): Trade
    {
        $fee = $amount * 0.01;
        $totalCost = $amount + $fee;

        if ($user->balance < $totalCost) {
            throw new \InvalidArgumentException('Insufficient balance.');
        }

        $shares = $amount / $price;

        // 1. Deduct balance
        $this->userRepository->updateBalance($user, -$totalCost);

        // 2. Add shares to market
        $this->marketRepository->addShares($market, $outcome, $shares);
        $market->refresh();

        // 3. Recalculate price
        $this->marketRepository->updatePrices($market);

        // 4. Update volume
        $this->marketRepository->addVolume($market, $amount);

        // 5. Update position
        $position = $this->positionRepository->findOrCreate($user->id, $market->id);
        $this->positionRepository->addShares($position, $outcome, $shares, $price);

        // 6. Record trade
        $trade = $this->tradeRepository->create([
            'user_id' => $user->id,
            'market_id' => $market->id,
            'side' => 'BUY',
            'outcome' => $outcome,
            'shares' => $shares,
            'price' => $price,
            'amount' => $amount,
        ]);

        // 7. Update stats
        $this->statsRepository->updateUserStats($user->id, $amount);
        $this->statsRepository->updateMarketStats($market->id, $user->id, $amount);

        return $trade;
    }

    private function executeSell($user, $market, string $outcome, float $price, float $amount): Trade
    {
        $position = $this->positionRepository->findOrCreate($user->id, $market->id);
        $availableShares = $this->positionRepository->getAvailableShares($position, $outcome);

        $shares = $amount / $price;
        $sellShares = min($shares, $availableShares);

        if ($sellShares <= 0) {
            throw new \InvalidArgumentException('No shares to sell.');
        }

        $sellAmount = $sellShares * $price;
        $fee = $sellAmount * 0.01;
        $netAmount = $sellAmount - $fee;

        // 1. Add balance
        $this->userRepository->updateBalance($user, $netAmount);

        // 2. Remove shares from market
        $this->marketRepository->removeShares($market, $outcome, $sellShares);
        $market->refresh();

        // 3. Recalculate price
        $this->marketRepository->updatePrices($market);

        // 4. Update volume
        $this->marketRepository->addVolume($market, $sellAmount);

        // 5. Update position
        $this->positionRepository->removeShares($position, $outcome, $sellShares);

        // 6. Calculate profit
        $avgPrice = $outcome === 'YES' ? (float) $position->avg_yes_price : (float) $position->avg_no_price;
        $profit = ($price - $avgPrice) * $sellShares;
        $this->statsRepository->updateUserProfit($user->id, $profit);

        // 7. Record trade
        $trade = $this->tradeRepository->create([
            'user_id' => $user->id,
            'market_id' => $market->id,
            'side' => 'SELL',
            'outcome' => $outcome,
            'shares' => $sellShares,
            'price' => $price,
            'amount' => $sellAmount,
        ]);

        // 8. Update stats
        $this->statsRepository->updateUserStats($user->id, $sellAmount);
        $this->statsRepository->updateMarketStats($market->id, $user->id, $sellAmount);

        return $trade;
    }
}
