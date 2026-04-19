import { useState, useEffect, Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import EmotionTracker from '@/Components/EmotionTracker';
import { Game } from '@/Components/Games/pages/Game';

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
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const startSession = async () => {
            try {
                const response = await axios.post('/api/game-sessions/start', {
                    game_id: game.id
                });
                setSessionId(response.data.session_id);
                setLoading(false);
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                setLoading(false);
            }
        };
        startSession();
    }, [game.id]);

    return (
        <AuthenticatedLayout>
            <Head title={`Jugando a ${game.title}`} />

            <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-white">
                        <p className="animate-pulse">Cargando sesión...</p>
                    </div>
                ) : (
                    <div className="w-full h-full">
                        {/* 1. EL JUEGO REAL DE THREE.JS */}
                        {/* Pasamos la función de finalizar si tu juego la necesita */}
                        <Game />

                        {/* 2. EL RASTREADOR DE EMOCIONES */}
                        {sessionId && (
                            <EmotionTracker
                                gameSessionId={sessionId}
                                startTime={startTime}
                            />
                        )}

                        {/* HUD / Título superpuesto */}
                        <div className="absolute top-5 left-5 z-20 pointer-events-none">
                            <h1 className="text-white text-2xl font-bold drop-shadow-lg">
                                {game.title}
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
