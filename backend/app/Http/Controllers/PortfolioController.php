<?php

namespace App\Http\Controllers;

use App\Services\PortfolioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function __construct(
        private PortfolioService $portfolioService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required.'], 400);
        }

        try {
            $portfolio = $this->portfolioService->getPortfolio((int) $userId);
            return response()->json($portfolio);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function history(Request $request): JsonResponse
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required.'], 400);
        }

        $trades = $this->portfolioService->getTradeHistory((int) $userId);

        return response()->json($trades->map(fn ($t) => [
            'id' => $t->id,
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
