<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logsheets', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('status')->default('new');
            $table->foreignId('vehicle_id')->constrained()->restrictOnDelete();
            $table->date('start_load_date')->nullable();
            $table->time('start_load_time')->nullable();
            $table->date('dispatch_date')->nullable();
            $table->time('dispatch_time')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logsheets');
    }
};
