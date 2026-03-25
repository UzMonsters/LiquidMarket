<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TradeExecuteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'market_id' => 'required|integer|exists:markets,id',
            'side' => 'required|in:BUY,SELL',
            'outcome' => 'required|in:YES,NO',
            'amount' => 'required|numeric|min:0.01',
        ];
    }
}
