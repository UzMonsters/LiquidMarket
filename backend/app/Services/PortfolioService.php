<?php

namespace App\Services;

use App\Repositories\PositionRepository;
use App\Repositories\TradeRepository;
use App\Repositories\UserRepository;

class PortfolioService
{
    public function __construct(
        private UserRepository $userRepository,
        private PositionRepository $positionRepository,
        private TradeRepository $tradeRepository,
    ) {}

    public function getPortfolio(int $userId): array
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found.');
        }

        $positions = $this->positionRepository->getByUser($userId);

        // Calculate PnL for each position
        $positionsWithPnl = $positions->map(function ($position) {
            $market = $position->market;
            $yesPnl = 0;
            $noPnl = 0;

            if ($position->yes_shares > 0) {
                $yesPnl = ((float) $market->price_yes - (float) $position->avg_yes_price) * (float) $position->yes_shares;
            }
            if ($position->no_shares > 0) {
                $noPnl = ((float) $market->price_no - (float) $position->avg_no_price) * (float) $position->no_shares;
            }

            return [
                'market_id' => $position->market_id,
                'market_title' => $market->title,
                'market_status' => $market->status,
                'yes_shares' => round((float) $position->yes_shares, 4),
                'no_shares' => round((float) $position->no_shares, 4),
                'avg_yes_price' => round((float) $position->avg_yes_price, 4),
                'avg_no_price' => round((float) $position->avg_no_price, 4),
                'yes_pnl' => round($yesPnl, 2),
                'no_pnl' => round($noPnl, 2),
                'total_pnl' => round($yesPnl + $noPnl, 2),
            ];
        });

        return [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'balance' => round((float) $user->balance, 2),
            ],
            'positions' => $positionsWithPnl,
        ];
    }

    public function getTradeHistory(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->tradeRepository->getByUser($userId);
    }
}
