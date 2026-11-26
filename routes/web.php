<?php

use App\Http\Controllers\JobController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\LogsheetController;
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
    Route::get('orders/import/{id}/status', [OrderController::class, 'importStatus'])
        ->name('orders.import.status');
    Route::get('orders/planning', [OrderController::class, 'planning'])->name('orders.planning');
    Route::patch('orders/reorder', [OrderController::class, 'reorder'])->name('orders.reorder');
    Route::get('orders/map', [OrderController::class, 'map'])->name('orders.map');

    Route::get('logsheets', [LogsheetController::class, 'index'])->name('logsheets.index');
    Route::get('logsheets/create', [LogsheetController::class, 'create'])->name('logsheets.create');
    Route::post('logsheets', [LogsheetController::class, 'store'])->name('logsheets.store');
    Route::get('logsheets/{logsheet}', [LogsheetController::class, 'show'])->name('logsheets.show');
    Route::get('logsheets/{logsheet}/edit', [LogsheetController::class, 'edit'])->name('logsheets.edit');
    Route::put('logsheets/{logsheet}', [LogsheetController::class, 'update'])->name('logsheets.update');
    Route::delete('logsheets/{logsheet}', [LogsheetController::class, 'destroy'])->name('logsheets.destroy');

    Route::post('logsheets/{logsheet}/storeJobOrder', [LogsheetController::class, 'storeJobOrder'])
        ->name('logsheets.storeJobOrder');

    Route::get('jobs/planning', [JobController::class, 'planning'])->name('jobs.planning');
    Route::patch('jobs/reorder', [JobController::class, 'reorder'])->name('jobs.reorder');
});

require __DIR__.'/settings.php';
