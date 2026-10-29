<?php

use App\Http\Controllers\KpiController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('vehicles', VehicleController::class);

    Route::get('kpi', [KpiController::class, 'index'])->name('kpi.index');
    Route::post('kpi', [KpiController::class, 'store'])->name('kpi.store');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
});

require __DIR__.'/settings.php';
