// src/features/hud/components/HUD.tsx
import { TargetDisplay } from './TargetDisplay.tsx';
import { GameStats } from './GameStats.tsx';

interface HUDProps {
  score: number;
  timeLeft: number;
  targetName: string;
  targetImage: string;
}

// src/features/hud/components/HUD.tsx
export const HUD = ({ score, timeLeft, targetName, targetImage }: any) => {
  return (
    <div className="w-full pointer-events-none p-8 flex flex-col gap-4 flex-shrink-0">
      {/* Top Bar */}
      <div className="flex justify-between items-center pointer-events-auto">
        <div className="bg-white/90 backdrop-blur shadow-xl p-4 rounded-2xl border-2 border-indigo-500">
          <span className="block text-xs font-bold text-indigo-400 uppercase">Score</span>
          <span className="text-3xl font-black text-indigo-600">{score}</span>
        </div>
        
        <div className="bg-white/90 backdrop-blur shadow-xl p-4 rounded-2xl border-2 border-rose-500">
          <span className="block text-xs font-bold text-rose-400 uppercase">Time</span>
          <span className="text-3xl font-black text-rose-600">{timeLeft}s</span>
        </div>
      </div>

      {/* Bottom Target Box */}
      <div className="flex justify-center">
        <div className="pointer-events-auto bg-white/95 p-6 rounded-3xl shadow-2xl border-t-4 border-indigo-500 flex flex-col items-center">
          <p className="text-sm font-bold text-slate-500 mb-2">BUSCA ESTE OBJETO:</p>
          <div className="w-24 h-24 bg-indigo-50 rounded-2xl p-2 mb-2 ring-4 ring-indigo-100">
             <img src={targetImage} alt={targetName} className="w-full h-full object-contain" />
          </div>
          <p className="text-xl font-black text-indigo-900 uppercase tracking-tighter">{targetName}</p>
        </div>
      </div>
    </div>
  );
};