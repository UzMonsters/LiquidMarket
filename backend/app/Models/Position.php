<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Position extends Model
{
    protected $fillable = [
        'user_id',
        'market_id',
        'yes_shares',
        'no_shares',
        'avg_yes_price',
        'avg_no_price',
    ];

    protected function casts(): array
    {
        return [
            'yes_shares' => 'decimal:4',
            'no_shares' => 'decimal:4',
            'avg_yes_price' => 'decimal:4',
            'avg_no_price' => 'decimal:4',
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
