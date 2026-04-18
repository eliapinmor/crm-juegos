<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->validate([
            'foto_base64' => 'required|string',
        ]);
        $request->authenticate();

        $user = Auth::user();

        $nombreArchivo = trim($user->foto_facial);

        if (!str_contains($nombreArchivo, 'fotos_faciales/')) {
            $pathFinal = 'fotos_faciales/' . $nombreArchivo;
        } else {
            $pathFinal = $nombreArchivo;
        }

        if (!Storage::disk('public')->exists($pathFinal)) {
            Auth::logout();
            return back()->withErrors(['foto_base64' => "Archivo de referencia no encontrado."]);
        }

        $pathReferencia = Storage::disk('public')->path($pathFinal);

        if (is_dir($pathReferencia)) {
            Auth::logout();
            return back()->withErrors(['foto_base64' => 'Error: La ruta de referencia es un directorio, no una imagen.']);
        }
        $fileContents = @file_get_contents($pathReferencia);



        if ($fileContents === false) {

            Auth::logout();

            return back()->withErrors(['foto_base64' => 'No se pudo leer la imagen de referencia.']);

        }



        $fotoReferenciaData = base64_encode($fileContents);

        $fotoReferenciaBase64 = 'data:image/jpeg;base64,' .
            $fotoReferenciaData;



        try {
            $img1_raw = base64_decode(str_replace('data:image/jpeg;base64,', '', $fotoReferenciaBase64));
            $img2_raw = base64_decode(str_replace('data:image/jpeg;base64,', '', $request->foto_base64));

            // 2. Enviamos como ARCHIVOS (attach) en lugar de JSON
            $response = Http::timeout(60)
                ->attach('img1', $img1_raw, 'referencia.jpg') // Campo 'img1' como espera Python
                ->attach('img2', $img2_raw, 'captura.jpg')    // Campo 'img2' como espera Python
                ->post('http://faceid-service:5000/verify');

            $resultado = $response->json();

            if ($response->successful()) {
                $distancia = $resultado['distance'] ?? 1.0;

                // Con Facenet (que es el que tienes en main.py),
                // una distancia menor a 0.40 suele ser positivo.
                // Vamos a ser un poco laxos con 0.55 por la luz.
                if (($resultado['verified'] ?? false) || $distancia <= 0.55) {
                    $request->session()->regenerate();
                    return redirect()->intended('games.index');
                }
            }

            Auth::logout();
            $distanciaMsg = isset($resultado['distance']) ? " (Distancia: " . round($resultado['distance'], 3) . ")" : "";
            return back()->withErrors(['foto_base64' => 'Identidad no verificada.' . $distanciaMsg]);

        } catch (\Exception $e) {
            Auth::logout();
            return back()->withErrors(['foto_base64' => 'Error de conexión con la IA: ' . $e->getMessage()]);
        }

        return redirect()->intended(route('games.index', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
