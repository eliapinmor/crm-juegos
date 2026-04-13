// src/features/hud/components/GameStats.tsx
export const GameStats = ({ label, value, color }: { label: string; value: string | number; color: string }) => {
  return (
    <div className="flex flex-col mb-2 last:mb-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{label}</span>
      <span className={`text-2xl font-black ${color} tabular-nums leading-tight`}>{value}</span>
    </div>
  );
};