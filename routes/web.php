<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('vehicles', VehicleController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::resource('users', UserController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
});

Route::resource('vehicles', VehicleController::class);

require __DIR__.'/settings.php';
