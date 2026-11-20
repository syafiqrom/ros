<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('vbeln');
            $table->date('pdate')->nullable();
            $table->string('name')->nullable();
            $table->string('addr1')->nullable();
            $table->string('addr2')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('tzone')->nullable();
            $table->string('volum')->nullable();
            $table->string('priority')->default('normal')->nullable();
            $table->string('plan_board')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->index(['plan_board', 'position']);
            $table->char('row_hash', 40)->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
