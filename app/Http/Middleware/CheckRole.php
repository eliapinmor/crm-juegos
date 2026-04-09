<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // dd([
        //     'Roles_del_Usuario' => $request->user()->roles->pluck('name')->toArray(),
        //     'Roles_Permitidos' => $roles,
        //     '¿Tiene_Acceso?' => $request->user()->roles()->whereIn('name', $roles)->exists()
        // ]);

        if (!$request->user() || !$request->user()->roles()->whereIn('name', $roles)->exists()) {
            return redirect('/')->with('error', 'No tienes permiso.');
        }
        return $next($request);
    }
}
