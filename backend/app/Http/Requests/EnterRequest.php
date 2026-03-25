<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|min:2|max:50',
        ];
    }
}
