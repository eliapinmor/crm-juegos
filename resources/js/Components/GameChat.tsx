import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Message {
    id: number;
    content: string;
    user: { name: string };
    created_at: string;
}

interface Props {
    gameId: number;
    initialMessages: Message[];
}

export default function GameChat({ gameId, initialMessages }: Props) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // GameChat.tsx

    useEffect(() => {
        const channel = window.Echo.channel(`chat.${gameId}`);

        channel.subscribed(() => {
            console.log('¡Suscrito con éxito al canal!');
        });

        // Escuchamos el nombre corto que definimos en broadcastAs
        channel.listen('.MessageSent', (e: { message: Message }) => {
            console.log('¡EVENTO RECIBIDO!', e);
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            window.Echo.leave(`chat.${gameId}`);
        };
    }, [gameId]);

    // Auto-scroll al recibir mensajes
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('/messages', {
                content: newMessage,
                game_id: gameId,
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error enviando mensaje', error);
        }
    };

    return (
        <div className="flex h-64 flex-col overflow-hidden rounded-lg border border-gray-700 bg-white shadow-xl dark:bg-gray-800">
            {/* Lista de Mensajes */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                        <div className="text-sm">
                            <span className="font-bold text-indigo-400">
                                {msg.user.name}
                            </span>
                            <p className="text-gray-200">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Formulario */}
            <form
                onSubmit={sendMessage}
                className="flex gap-2 border-t border-gray-700 p-2"
            >
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded bg-gray-900 p-2 text-xs text-white"
                    placeholder="Escribe un mensaje..."
                />
                <button
                    type="submit"
                    className="rounded bg-indigo-600 px-3 py-1 text-xs text-white"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
