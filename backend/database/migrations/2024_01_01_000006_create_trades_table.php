<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('market_id')->constrained()->onDelete('cascade');
            $table->enum('side', ['BUY', 'SELL']);
            $table->enum('outcome', ['YES', 'NO']);
            $table->decimal('shares', 15, 4);
            $table->decimal('price', 8, 4);
            $table->decimal('amount', 15, 2);
            $table->timestamps();

            $table->index(['user_id', 'market_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
