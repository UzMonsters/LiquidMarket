<?php

namespace App\Services;

use App\Repositories\MarketRepository;
use App\Repositories\TradeRepository;
use App\Repositories\UserRepository;

class AdminService
{
    public function __construct(
        private UserRepository $userRepository,
        private MarketRepository $marketRepository,
        private TradeRepository $tradeRepository,
    ) {}

    public function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->userRepository->allWithStats();
    }

    public function getAllTrades(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->tradeRepository->all();
    }
}
