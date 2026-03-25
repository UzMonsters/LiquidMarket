<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('market_id')->constrained()->onDelete('cascade');
            $table->decimal('yes_shares', 15, 4)->default(0);
            $table->decimal('no_shares', 15, 4)->default(0);
            $table->decimal('avg_yes_price', 8, 4)->default(0);
            $table->decimal('avg_no_price', 8, 4)->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'market_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
