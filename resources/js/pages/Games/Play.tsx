import { useState, useEffect, Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import EmotionTracker from '@/Components/EmotionTracker';
import { Game } from '@/Components/Games/pages/Game';
import GameChat from '@/Components/GameChat';

interface Message {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    game: {
        id: number;
        title: string;
        component_name: string;
    };
    messages: Message[];
}

export default function Play({ game, messages }: Props) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const startSession = async () => {
            try {
                const response = await axios.post('/api/game-sessions/start', {
                    game_id: game.id,
                });
                setSessionId(response.data.session_id);
                setLoading(false);
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                setLoading(false);
            }
        };
        startSession();
    }, [game.id]);

    return (
        <AuthenticatedLayout>
            <Head title={`Jugando a ${game.title}`} />

            <div className="relative flex h-screen w-full overflow-hidden bg-gray-950">
                {' '}
                {/* Añadido flex */}
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center text-white">
                        <p className="animate-pulse">Cargando sesión...</p>
                    </div>
                ) : (
                    <>
                        {/* Contenedor del Juego (Ocupa todo el espacio restante) */}
                        <div className="relative h-full flex-1">
                            <Game />
                            {sessionId && (
                                <EmotionTracker
                                    gameSessionId={sessionId}
                                    startTime={startTime}
                                />
                            )}

                            <div className="pointer-events-none absolute top-5 left-5 z-20">
                                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                                    {game.title}
                                </h1>
                            </div>
                        </div>

                        {/* Contenedor del Chat (Barra lateral derecha) */}
                        <div className="flex h-full w-80 flex-col border-l border-gray-800 bg-gray-900 p-4">
                            <GameChat
                                gameId={game.id}
                                initialMessages={messages}
                            />
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
