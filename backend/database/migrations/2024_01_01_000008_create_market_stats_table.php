<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('market_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('total_volume', 15, 2)->default(0);
            $table->unsignedInteger('total_trades')->default(0);
            $table->unsignedInteger('unique_users')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_stats');
    }
};
