<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Market extends Model
{
    protected $fillable = [
        'title',
        'status',
        'price_yes',
        'price_no',
        'yes_total',
        'no_total',
        'liquidity',
        'volume',
        'resolved_outcome',
    ];

    protected function casts(): array
    {
        return [
            'price_yes' => 'decimal:4',
            'price_no' => 'decimal:4',
            'yes_total' => 'decimal:4',
            'no_total' => 'decimal:4',
            'liquidity' => 'decimal:2',
            'volume' => 'decimal:2',
        ];
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }

    public function stats(): HasOne
    {
        return $this->hasOne(MarketStat::class);
    }
}
