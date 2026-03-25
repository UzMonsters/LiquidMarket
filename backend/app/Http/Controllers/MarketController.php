<?php

namespace App\Http\Controllers;

use App\Services\MarketService;
use Illuminate\Http\JsonResponse;

class MarketController extends Controller
{
    public function __construct(
        private MarketService $marketService,
    ) {}

    public function index(): JsonResponse
    {
        $markets = $this->marketService->getAll();

        return response()->json($markets->map(fn ($m) => [
            'id' => $m->id,
            'title' => $m->title,
            'status' => $m->status,
            'price_yes' => (float) $m->price_yes,
            'price_no' => (float) $m->price_no,
            'yes_total' => (float) $m->yes_total,
            'no_total' => (float) $m->no_total,
            'liquidity' => (float) $m->liquidity,
            'volume' => (float) $m->volume,
            'resolved_outcome' => $m->resolved_outcome,
            'created_at' => $m->created_at,
        ]));
    }

    public function show(int $id): JsonResponse
    {
        $market = $this->marketService->getById($id);

        if (!$market) {
            return response()->json(['error' => 'Market not found.'], 404);
        }

        return response()->json([
            'id' => $market->id,
            'title' => $market->title,
            'status' => $market->status,
            'price_yes' => (float) $market->price_yes,
            'price_no' => (float) $market->price_no,
            'yes_total' => (float) $market->yes_total,
            'no_total' => (float) $market->no_total,
            'liquidity' => (float) $market->liquidity,
            'volume' => (float) $market->volume,
            'resolved_outcome' => $market->resolved_outcome,
            'created_at' => $market->created_at,
        ]);
    }
}
