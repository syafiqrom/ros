<?php

use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
});

require __DIR__.'/settings.php';
