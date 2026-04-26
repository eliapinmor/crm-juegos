import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

interface Props {
    gameSessionId: number;
    startTime: number;
}

export default function EmotionTracker({ gameSessionId, startTime }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [currentEmotion, setCurrentEmotion] = useState<string>("loading...");

    useEffect(() => {
        const loadModelsAndStart = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);

                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCurrentEmotion("waiting...");
                }
            } catch (err) {
                console.error("Error:", err);
                setCurrentEmotion("error");
            }
        };

        loadModelsAndStart();

        intervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const detection = await faceapi.detectSingleFace(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceExpressions();

                if (detection) {
                    const expressions = detection.expressions;
                    const bestEmotion = (Object.keys(expressions) as Array<keyof typeof expressions>)
                        .reduce((a, b) => expressions[a] > expressions[b] ? a : b);

                    setCurrentEmotion(bestEmotion);

                    sendEmotionToLaravel(bestEmotion, expressions[bestEmotion]);
                } else {
                    setCurrentEmotion("not detected");
                }
            }
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, [gameSessionId, startTime]);

    const sendEmotionToLaravel = async (emotion: string, confidence: number) => {
        const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
        try {
            await axios.post('/api/emotions', {
                game_session_id: gameSessionId,
                emotion: emotion,
                confidence: parseFloat(confidence.toFixed(4)),
                second_offset: secondsElapsed,
            });
        } catch (error) {
            console.error("Error api:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-64 border-2 border-indigo-600 rounded-lg overflow-hidden shadow-2xl z-50 bg-black">
            <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-36 object-cover opacity-80"
            />
            <div className="bg-indigo-600 text-white py-1 px-2">
                <p className="text-[10px] uppercase font-bold opacity-70">Emotion</p>
                <p className="text-sm font-mono uppercase tracking-wider">
                    {currentEmotion}
                </p>
            </div>
        </div>
    );
}
