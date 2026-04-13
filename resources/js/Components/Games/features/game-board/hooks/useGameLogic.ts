// src/features/game-board/hooks/useGameLogic.ts
import { useState, useEffect, useCallback } from "react";
import { prepareLevel } from "../utils/levelGenerator";
import { GAME_CONFIG } from "../data/gameConfig";

export const useGameLogic = () => {
  const [levelData, setLevelData] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errors, setErrors] = useState(0);

  const startNewLevel = useCallback(() => {
    const data = prepareLevel();
    setLevelData(data);
  }, []);

  useEffect(() => {
    if (isGameOver || !levelData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, levelData]);
  useEffect(() => {
    startNewLevel();
  }, [startNewLevel]);

  const handleObjectClick = (id: string) => {
    if (isGameOver) return;

    if (id === levelData?.target.id) {
      // ACIERTO
      setScore((s) => s + GAME_CONFIG.POINTS_PER_HIT);
      startNewLevel();
    } else {
      // ERROR
      const newErrorCount = errors + 1;
      setErrors(newErrorCount);
      setScore((s) => Math.max(0, s + GAME_CONFIG.POINTS_PER_MISS));

      // Verificar si perdió por demasiados errores
      if (newErrorCount >= GAME_CONFIG.MAX_ERRORS_ALLOWED) {
        setIsGameOver(true);
      }
    }
  };

  return { levelData, score, timeLeft, handleObjectClick, isGameOver, errors };
};
