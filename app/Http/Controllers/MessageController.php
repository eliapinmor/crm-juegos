<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'game_id' => 'required|exists:games,id',
        ]);

        $message = Message::create([
            'content' => $validated['content'],
            'game_id' => $validated['game_id'],
            'user_id' => Auth::id(),
        ]);

        $message->load('user');

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Exception $e) {
            \Log::error('REVERB ERROR: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
        return response()->json($message);
    }
}
