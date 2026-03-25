<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStat extends Model
{
    protected $fillable = [
        'user_id',
        'total_volume',
        'total_profit',
        'total_trades',
    ];

    protected function casts(): array
    {
        return [
            'total_volume' => 'decimal:2',
            'total_profit' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
