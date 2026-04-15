<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected $fillable = ['user_id', 'game_id', 'started_at', 'ended_at', 'score', 'duration', 'payload'];

    // Relación con el usuario que juega
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el juego jugado
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
