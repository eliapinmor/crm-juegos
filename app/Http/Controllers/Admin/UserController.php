<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Muestra el listado de usuarios con sus roles.
     */
    public function index()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo usuario.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all()
        ]);
    }

    /**
     * Guarda el nuevo usuario en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role, // Mantenemos la columna string para el frontend
        ]);

        // Sincronizamos con la tabla pivote de roles
        $role = Role::where('name', $request->role)->first();
        $user->roles()->attach($role->id);

        return redirect()->route('admin.users.index')->with('message', 'Usuario creado con éxito.');
    }

    /**
     * Mostrar un usuario específico (opcional en CRUDs básicos).
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Muestra el formulario de edición.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all()
        ]);
    }

    /**
     * Actualiza los datos del usuario.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|exists:roles,name',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // Si se proporciona una nueva contraseña
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $user->update(['password' => Hash::make($request->password)]);
        }

        // Actualizamos la relación en la tabla pivote
        $role = Role::where('name', $request->role)->first();
        $user->roles()->sync([$role->id]);

        return redirect()->route('admin.users.index')->with('message', 'Usuario actualizado.');
    }

    /**
     * Elimina al usuario de la base de datos.
     */
    public function destroy(User $user)
    {
        // Evitar que el admin se borre a sí mismo
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('message', 'Usuario eliminado correctamente.');
    }
}
