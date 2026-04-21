import { useState, useEffect, Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import EmotionTracker from '@/Components/EmotionTracker';
import GameChat from '@/Components/GameChat';
import { GAME_COMPONENTS } from '@/Components/Games/GameRegistry';

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

    const SelectedGame = GAME_COMPONENTS[game.component_name] || null;

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
                       <div className="relative h-full flex-1">
                            <Suspense fallback={
                                <div className="flex h-full w-full items-center justify-center bg-black">
                                    <p className="text-white">Cargando Assets del Juego...</p>
                                </div>
                            }>
                                {SelectedGame ? (
                                    <SelectedGame gameId={game.id} />
                                ) : (
                                    <div className="p-10 text-red-500">Error: Componente [{game.component_name}] no encontrado.</div>
                                )}
                            </Suspense>

                            {sessionId && (
                                <EmotionTracker gameSessionId={sessionId} startTime={startTime}/>
                            )}
                        </div>

                        <div className="flex h-full w-80 flex-col border-l border-gray-800 bg-gray-900 p-4">
                            <GameChat gameId={game.id} initialMessages={messages} />
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
