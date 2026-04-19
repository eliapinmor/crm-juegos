import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

interface Props {
    gameSessionId: number;
    startTime: number;
}

export default function EmotionTracker({ gameSessionId }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const loadModelsAndStart = async () => {
            // 1. Cargar modelos desde /public/models
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);

            // 2. Iniciar Cámara
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                });
        };

        loadModelsAndStart();

        // 3. Intervalo de detección (cada 3 segundos)
        intervalRef.current = setInterval(async () => {
            if (videoRef.current) {
                const detection = await faceapi.detectSingleFace(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceExpressions();

                if (detection) {
                    // Obtener la emoción con mayor puntaje
                    const expressions = detection.expressions;
                    const bestEmotion = (Object.keys(expressions) as Array<keyof typeof expressions>)
                        .reduce((a, b) => expressions[a] > expressions[b] ? a : b);

                    sendEmotionToLaravel(bestEmotion, expressions[bestEmotion]);
                }
            }
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const sendEmotionToLaravel = async (emotion: string, confidence: number) => {
        const secondsElapsed = Math.floor((Date.now() - startTime) / 1000); // Cálculo real
        try {
            await axios.post('/api/emotions', {
                game_session_id: gameSessionId,
                emotion: emotion,
                confidence: confidence.toFixed(4),
                second_offset: secondsElapsed,
            });
        } catch (error) {
            console.error("Error enviando emoción:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-48 border-2 border-indigo-500 rounded-lg overflow-hidden shadow-xl">
            {/* El video puede estar oculto o pequeño para que el usuario se vea */}
            <video ref={videoRef} autoPlay muted className="w-full" />
            <p className="bg-indigo-500 text-white text-xs text-center py-1">Detectando Emociones...</p>
        </div>
    );
}