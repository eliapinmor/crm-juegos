import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import EmotionTracker from '@/Components/EmotionTracker'; 

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
    const [startTime] = useState(Date.now()); // Para calcular el second_offset

    useEffect(() => {
        const startSession = async () => {
            try {
                const response = await axios.post('/api/game-sessions/start', {
                    game_id: game.id
                });
                setSessionId(response.data.session_id);
                setLoading(false);
            } catch (error) {
                console.error("Error al iniciar sesión de juego:", error);
                setLoading(false);
            }
        };
        startSession();
    }, [game.id]);

    const handleGameOver = async (score: number) => {
        if (!sessionId) return;
        try {
            await axios.post(`/api/game-sessions/${sessionId}/end`, {
                score: score,
                payload: { message: "Partida finalizada" }
            });
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
                    <div id="game-container">
                        <h1 className="text-white absolute top-5 left-5">Jugando: {game.title}</h1>
                        
                        {/* 2. RENDERIZA EL RASTREADOR SOLO SI HAY SESIÓN */}
                        {sessionId && (
                            <EmotionTracker 
                                gameSessionId={sessionId} 
                                startTime={startTime} 
                            />
                        )}

                        <button
                            onClick={() => handleGameOver(100)}
                            className="absolute bottom-10 right-10 bg-red-500 p-2 text-white z-50"
                        >
                            Simular Fin de Juego
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}