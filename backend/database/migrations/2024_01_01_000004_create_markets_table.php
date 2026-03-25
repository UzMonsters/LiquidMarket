<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('markets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('status', ['OPEN', 'CLOSED', 'RESOLVED'])->default('OPEN');
            $table->decimal('price_yes', 8, 4)->default(0.5);
            $table->decimal('price_no', 8, 4)->default(0.5);
            $table->decimal('yes_total', 15, 4)->default(0);
            $table->decimal('no_total', 15, 4)->default(0);
            $table->decimal('liquidity', 15, 2)->default(5000);
            $table->decimal('volume', 15, 2)->default(0);
            $table->enum('resolved_outcome', ['YES', 'NO'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('markets');
    }
};
