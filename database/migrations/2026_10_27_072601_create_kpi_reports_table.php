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
        Schema::create('kpi_reports', function (Blueprint $table) {
            $table->id();
            $table->string('truck_load_no')->nullable();
            $table->string('job_no')->nullable();
            $table->date('job_date')->nullable();
            $table->string('daikin_do')->nullable();
            $table->string('delivery_point_name')->nullable();
            $table->string('truck_no')->nullable();
            $table->dateTime('iod_date')->nullable();
            $table->date('est_delivery_date')->nullable();
            $table->string('est_delivery_time')->nullable();
            $table->string('kpi_pass')->nullable();
            $table->timestamps();

            $table->unique(['job_no', 'daikin_do']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_reports');
    }
};
