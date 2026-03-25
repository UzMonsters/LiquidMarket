<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserStat;

class UserRepository
{
    public function create(string $username): User
    {
        $user = User::create([
            'username' => $username,
            'balance' => 100000,
        ]);

        UserStat::create(['user_id' => $user->id]);

        return $user;
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    public function updateBalance(User $user, float $amount): void
    {
        $user->update(['balance' => $user->balance + $amount]);
    }

    public function allWithStats(): \Illuminate\Database\Eloquent\Collection
    {
        return User::with('stats')->get();
    }
}
