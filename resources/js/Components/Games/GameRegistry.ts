import { lazy } from 'react';

// Registramos los juegos disponibles
// La clave debe coincidir con el 'component_name' que guardas en la base de datos
export const GAME_COMPONENTS: Record<string, any> = {
    'BusquedaVisual': lazy(() => import('./pages/Game')), // Tu juego actual
    'MathQuiz': lazy(() => import('./pages/MathQuiz')),  // Un juego fake para probar
};