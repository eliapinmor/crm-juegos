<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        Storage::disk('public')->deleteDirectory('fotos_faciales');
        Storage::disk('public')->makeDirectory('fotos_faciales');

        $masterImagePath = storage_path('app/seed_data/default_face.jpg');

        if (!File::exists($masterImagePath)) {
            $this->command->error("No existe la imagen proporcionada. ruta: $masterImagePath");
            return;
        }

        // Definimos los usuarios a crear
        $usuarios = [
            ['name' => 'Admin', 'email' => 'admin@admin.com', 'role' => 'admin'],
            ['name' => 'Gestor', 'email' => 'gestor@gestor.com', 'role' => 'gestor'],
            ['name' => 'Jugador', 'email' => 'jugador@jugador.com', 'role' => 'jugador'],
        ];

        foreach ($usuarios as $userData) {
            $nombreArchivo = 'faceid_' . Str::random(10) . '_' . time() . '.jpg';
            $rutaRelativa = 'fotos_faciales/' . $nombreArchivo;
            
            Storage::disk('public')->put($rutaRelativa, File::get($masterImagePath));

            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'foto_facial' => $rutaRelativa,
            ]);

            $role = Role::where('name', $userData['role'])->first();
            if ($role) {
                $user->roles()->attach($role->id);
            } else {
                $this->command->warn("El rol '{$userData['role']}' no existe para el usuario {$userData['name']}.");
            }
        }

        $this->command->info('UserSeeder ejecutado: Usuarios creados con sus fotos de referencia.');
    }
}