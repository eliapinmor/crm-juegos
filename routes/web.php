<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');

    Route::prefix('games')->group(function () {
        // Galería de juegos (Dashboard de jugador)
        Route::get('/', [GameController::class, 'index'])->name('games.index');

        // La pantalla de juego (El componente Play.tsx que carga tu Three.js)
        Route::get('/{slug}', [GameController::class, 'show'])->name('games.show');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin,gestor'])->prefix('admin')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/games', [AdminGameController::class, 'index'])->name('admin.games.index');

    // O mejor aún, usa resource para tener todas las funciones (store, update, destroy):
    Route::resource('games', AdminGameController::class)->names([
        'index' => 'admin.games.index',
        'store' => 'admin.games.store',
        'update' => 'admin.games.update',
        'destroy' => 'admin.games.destroy',
    ]);

    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class)->names([
            'index' => 'admin.users.index',
            'create' => 'admin.users.create',
            'store' => 'admin.users.store',
            'show' => 'admin.users.show',
            'edit' => 'admin.users.edit',
            'update' => 'admin.users.update',
            'destroy' => 'admin.users.destroy',
        ]);
    });
});

require __DIR__ . '/auth.php';
