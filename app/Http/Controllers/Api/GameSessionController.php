<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GameSessionController extends Controller
{
    /**
     * Inicia una nueva sesión de juego.
     */
    public function start(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
        ]);

        $session = GameSession::create([
            'user_id'    => $request->user()->id,
            'game_id'    => $request->game_id,
            'started_at' => now(),
        ]);

        return response()->json([
            'session_id' => $session->id,
            'status'     => 'success'
        ], 201);
    }

    /**
     * Finaliza la sesión de juego y guarda los resultados.
     */
    public function end(Request $request, $id)
    {
        $session = GameSession::where('user_id', $request->user()->id)
                              ->findOrFail($id);

        $startedAt = Carbon::parse($session->started_at);
        $endedAt   = now();

        $duration = $endedAt->diffInSeconds($startedAt);

        $session->update([
            'ended_at' => $endedAt,
            'score'    => $request->input('score', 0),
            'duration' => $duration,
            'payload'  => $request->input('payload'),
        ]);

        return response()->json([
            'status'   => 'success',
            'duration' => $duration
        ]);
    }
}
