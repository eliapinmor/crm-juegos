// src/pages/Game.tsx
import { Scene } from '../features/game-board/components/Scene';
import { HUD } from '../features/hud/components/HUD';
import { useGameLogic } from '../features/game-board/hooks/useGameLogic';
import { GameOver } from './GameOver.tsx';

export const BusquedaVisual = () => {
    const {
        score,
        timeLeft,
        levelData,
        handleObjectClick,
        isGameOver,
        errors,
    } = useGameLogic();

    if (isGameOver) {
        return (
            <GameOver
                score={score}
                reason={timeLeft === 0 ? 'timeout' : 'errors'}
            />
        );
    }

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-100">
            {' '}
            {/* El HUD va primero en el orden de React pero con z-10 para estar encima */}
            <HUD
                score={score}
                timeLeft={timeLeft}
                targetName={levelData?.target.name}
                targetImage={levelData?.target.url}
            />
            {/* El Canvas de Three.js ocupa todo el fondo */}
            <Scene
                objects={levelData?.allObjects}
                onItemClick={handleObjectClick}
            />
        </div>
    );
};
