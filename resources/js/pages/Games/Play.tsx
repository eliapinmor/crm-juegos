import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios'; // Asegúrate de tener axios instalado

// Asumiendo que recibes el juego como prop desde el controlador de Laravel (Inertia)
interface Props {
    game: {
        id: number;
        title: string;
        component_name: string;
    };
}

export default function Play({ game }: Props) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. INICIAR SESIÓN AL CARGAR EL COMPONENTE
        const startSession = async () => {
            try {
                const response = await axios.post('/api/game-sessions/start', {
                    game_id: game.id
                });
                setSessionId(response.data.session_id);
                setLoading(false);
                console.log("Sesión de juego iniciada:", response.data.session_id);
            } catch (error) {
                console.error("Error al iniciar sesión de juego:", error);
                setLoading(false);
            }
        };

        startSession();

        // OPCIONAL: Finalizar sesión si el usuario cierra la pestaña o sale
        // Aunque lo ideal es que el juego llame a una función 'finish' al terminar.
    }, [game.id]);

    // 2. FUNCIÓN PARA TERMINAR LA PARTIDA
    // Esta función la llamarás desde dentro de tu lógica de juego (cuando muera, gane, etc.)
    const handleGameOver = async (score: number) => {
        if (!sessionId) return;

        try {
            await axios.post(`/api/game-sessions/${sessionId}/end`, {
                score: score,
                payload: {
                    // Aquí puedes mandar datos extra como "nivel alcanzado", etc.
                    message: "Partida finalizada por el usuario"
                }
            });
            console.log("Partida guardada correctamente");
        } catch (error) {
            console.error("Error al guardar la partida:", error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Jugando a ${game.title}`} />

            <div className="relative w-full h-screen bg-black">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-white">
                        Iniciando sesión de juego...
                    </div>
                ) : (
                    /* AQUÍ VA TU COMPONENTE DE THREE.JS */
                    /* Pasa la función handleGameOver al juego para que pueda avisar cuando termine */
                    <div id="game-container">
                        <h1 className="text-white absolute top-5 left-5">Jugando: {game.title}</h1>

                        {/* Ejemplo de cómo el juego llamaría al final */}
                        <button
                            onClick={() => handleGameOver(100)}
                            className="absolute bottom-10 right-10 bg-red-500 p-2 text-white"
                        >
                            Simular Fin de Juego (Score 100)
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
