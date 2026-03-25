<?php

namespace App\Http\Controllers;

use App\Http\Requests\TradeExecuteRequest;
use App\Http\Requests\TradeQuoteRequest;
use App\Services\TradingService;
use Illuminate\Http\JsonResponse;

class TradeController extends Controller
{
    public function __construct(
        private TradingService $tradingService,
    ) {}

    public function quote(TradeQuoteRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $quote = $this->tradingService->quote(
                $data['user_id'],
                $data['market_id'],
                $data['side'],
                $data['outcome'],
                $data['amount'],
            );

            return response()->json($quote);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function execute(TradeExecuteRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $trade = $this->tradingService->execute(
                $data['user_id'],
                $data['market_id'],
                $data['side'],
                $data['outcome'],
                $data['amount'],
            );

            $trade->load('market');

            return response()->json([
                'trade' => [
                    'id' => $trade->id,
                    'user_id' => $trade->user_id,
                    'market_id' => $trade->market_id,
                    'side' => $trade->side,
                    'outcome' => $trade->outcome,
                    'shares' => (float) $trade->shares,
                    'price' => (float) $trade->price,
                    'amount' => (float) $trade->amount,
                    'created_at' => $trade->created_at,
                ],
                'market' => [
                    'id' => $trade->market->id,
                    'price_yes' => (float) $trade->market->price_yes,
                    'price_no' => (float) $trade->market->price_no,
                    'yes_total' => (float) $trade->market->yes_total,
                    'no_total' => (float) $trade->market->no_total,
                    'volume' => (float) $trade->market->volume,
                ],
                'balance' => (float) $trade->user->fresh()->balance,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
