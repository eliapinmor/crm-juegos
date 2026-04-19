<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $fillable = [
        'content',
        'user_id',
        'game_id',
    ];

    /**
     * Relación: Un mensaje pertenece a un usuario (el autor).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Un mensaje pertenece a un juego (el contexto).
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
