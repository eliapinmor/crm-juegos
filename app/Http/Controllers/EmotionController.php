<?php

namespace App\Http\Controllers;

use App\Models\EmotionSnapshot;
use Illuminate\Http\Request;

class EmotionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_session_id' => 'required|exists:game_sessions,id',
            'emotion' => 'required|string',
            'confidence' => 'required|numeric',
            'second_offset' => 'required|integer',
        ]);

        EmotionSnapshot::create($validated);

        return response()->json(['status' => 'success']);
    }
}
