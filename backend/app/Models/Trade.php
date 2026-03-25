<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trade extends Model
{
    protected $fillable = [
        'user_id',
        'market_id',
        'side',
        'outcome',
        'shares',
        'price',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'shares' => 'decimal:4',
            'price' => 'decimal:4',
            'amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class);
    }
}
