<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function enter(EnterRequest $request): JsonResponse
    {
        $user = $this->authService->enter($request->validated()['username']);

        return response()->json([
            'user_id' => $user->id,
            'username' => $user->username,
            'balance' => (float) $user->balance,
        ]);
    }
}
