<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class AuthService
{
    public function __construct(
        private UserRepository $userRepository,
    ) {}

    public function enter(string $username): User
    {
        $existing = $this->userRepository->findByUsername($username);
        if ($existing) {
            return $existing;
        }

        return $this->userRepository->create($username);
    }
}
