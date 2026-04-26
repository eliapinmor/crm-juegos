<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Game::create([
            'title' => 'Buscador de Objetos 3D',
            'slug' => 'buscador-objetos',
            'description' => 'Encuentra los objetos perdidos en la escena 3D.',
            'thumbnail' => 'storage/thumbnails/busqueda_visual.jpg',
            'component_name' => 'Game',
        ]);

        Game::create([
            'title' => 'Quiz de Mates',
            'slug' => 'math-quiz',
            'description' => 'Encuentra los objetos perdidos en la escena 3D.',
            'thumbnail' => 'storage/thumbnails/math_quiz.jpg',
            'component_name' => 'MathQuiz',
        ]);
    }
}
