import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Message {
    id: number;
    content: string;
    user: { name: string;};
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

    useEffect(() => {
        // 1. Escuchar el canal del juego (Canal Público según tu informe)
        // Usamos el nombre del canal definido en el Evento de Laravel
        window.Echo.channel(`chat.${gameId}`)
            .listen('MessageSent', (e: { message: Message }) => {
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
                game_id: gameId
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error enviando mensaje", error);
        }
    };

    return (
        <div className="flex flex-col h-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            {/* Lista de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                        <div className="text-sm">
                            <span className="font-bold text-indigo-400">{msg.user.name}</span>
                            <p className="text-gray-200">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Formulario */}
            <form onSubmit={sendMessage} className="p-2 border-t border-gray-700 flex gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-900 text-white text-xs p-2 rounded"
                    placeholder="Escribe un mensaje..."
                />
                <button type="submit" className="bg-indigo-600 px-3 py-1 rounded text-white text-xs">
                    Enviar
                </button>
            </form>
        </div>
    );
}
