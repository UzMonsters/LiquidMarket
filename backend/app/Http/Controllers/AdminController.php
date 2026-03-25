<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateMarketRequest;
use App\Http\Requests\ResolveMarketRequest;
use App\Services\AdminService;
use App\Services\MarketService;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function __construct(
        private AdminService $adminService,
        private MarketService $marketService,
    ) {}

    public function createMarket(CreateMarketRequest $request): JsonResponse
    {
        $data = $request->validated();
        $market = $this->marketService->create(
            $data['title'],
            $data['liquidity'] ?? 5000,
        );

        return response()->json($market, 201);
    }

    public function closeMarket(int $id): JsonResponse
    {
        try {
            $market = $this->marketService->close($id);
            return response()->json($market);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function resolveMarket(int $id, ResolveMarketRequest $request): JsonResponse
    {
        try {
            $market = $this->marketService->resolve($id, $request->validated()['outcome']);
            return response()->json($market);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function users(): JsonResponse
    {
        $users = $this->adminService->getAllUsers();

        return response()->json($users->map(fn ($u) => [
            'id' => $u->id,
            'username' => $u->username,
            'balance' => (float) $u->balance,
            'total_volume' => (float) ($u->stats->total_volume ?? 0),
            'total_profit' => (float) ($u->stats->total_profit ?? 0),
            'total_trades' => (int) ($u->stats->total_trades ?? 0),
        ]));
    }

    public function trades(): JsonResponse
    {
        $trades = $this->adminService->getAllTrades();

        return response()->json($trades->map(fn ($t) => [
            'id' => $t->id,
            'user_id' => $t->user_id,
            'username' => $t->user->username ?? null,
            'market_id' => $t->market_id,
            'market_title' => $t->market->title ?? null,
            'side' => $t->side,
            'outcome' => $t->outcome,
            'shares' => (float) $t->shares,
            'price' => (float) $t->price,
            'amount' => (float) $t->amount,
            'created_at' => $t->created_at,
        ]));
    }
}
