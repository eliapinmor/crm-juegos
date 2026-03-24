<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        Role::create([
            'name' => 'admin',
            'description' => 'Administrador del sistema',
        ]);

        Role::create([
            'name' => 'gestor',
            'description' => 'Gestor de juegos',
        ]);

        Role::create([
            'name' => 'jugador',
            'description' => 'Jugador de la plataforma',
        ]);
    }
}
