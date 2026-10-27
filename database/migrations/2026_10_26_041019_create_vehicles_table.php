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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate_number');
            $table->string('brand');
            $table->string('model');
            $table->integer('capacity_metric_ton');
            $table->integer('capacity_cubic_meter');
            $table->decimal('cost_per_km', 10, 2)->default(0);
            $table->decimal('cost_per_hour', 10, 2)->default(0);
            $table->string('status')->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
