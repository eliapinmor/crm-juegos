<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ADMIN
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first()->id);

        // GESTOR
        $gestor = User::create([
            'name' => 'Gestor',
            'email' => 'gestor@gestor.com',
            'password' => Hash::make('password'),
        ]);
        $gestor->roles()->attach(Role::where('name', 'gestor')->first()->id);

        // JUGADOR
        $jugador = User::create([
            'name' => 'Jugador',
            'email' => 'jugador@jugador.com',
            'password' => Hash::make('password'),
        ]);
        $jugador->roles()->attach(Role::where('name', 'jugador')->first()->id);
    }
}
