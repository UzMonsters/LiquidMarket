<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketStat extends Model
{
    protected $fillable = [
        'market_id',
        'total_volume',
        'total_trades',
        'unique_users',
    ];

    protected function casts(): array
    {
        return [
            'total_volume' => 'decimal:2',
        ];
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class);
    }
}
