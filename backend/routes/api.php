<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\TradeController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/enter', [AuthController::class, 'enter']);

// Markets
Route::get('/markets', [MarketController::class, 'index']);
Route::get('/markets/{id}', [MarketController::class, 'show']);

// Trading
Route::post('/trades/quote', [TradeController::class, 'quote']);
Route::post('/trades/execute', [TradeController::class, 'execute']);

// Portfolio
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/trades/history', [PortfolioController::class, 'history']);

// Admin
Route::prefix('admin')->group(function () {
    Route::post('/markets', [AdminController::class, 'createMarket']);
    Route::post('/markets/{id}/close', [AdminController::class, 'closeMarket']);
    Route::post('/markets/{id}/resolve', [AdminController::class, 'resolveMarket']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/trades', [AdminController::class, 'trades']);
});
