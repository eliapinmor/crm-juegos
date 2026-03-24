<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'is_published',
        'url',
        'user_id',
    ];

    /**
     * Un juego pertenece a un usuario (creador).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
