<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmotionSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        "game_session_id",
        "emotion",
        "confidence",
        "second_offset",
    ];

    public function gameSession()
    {
        return $this->belongsTo(GameSession::class);
    }
}
