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
            'slug' => 'buscador-objetos', // Esta será la URL: /games/buscador-objetos
            'description' => 'Encuentra los objetos perdidos en la escena 3D.',
            'thumbnail' => 'https://via.placeholder.com/400x225?text=Buscador+3D',
            // Este nombre es vital para tu lógica de importación en React
            'component_name' => 'Game',
        ]);
    }
}
