<?php

use App\Http\Controllers\EmotionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameSessionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/game-sessions/start', [GameSessionController::class, 'start']);
    Route::post('/game-sessions/{id}/end', [GameSessionController::class, 'end']);
    Route::post('/emotions', [EmotionController::class, 'store']);
});
