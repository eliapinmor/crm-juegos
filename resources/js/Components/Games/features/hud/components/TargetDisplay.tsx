// src/features/hud/components/TargetDisplay.tsx

export const TargetDisplay = ({ name, image }: { name?: string; image?: string }) => {
  // Si no hay nombre aún, no renderizamos nada o mostramos un cargando
  if (!name) return null;

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-3">
      <p className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
        ENCUENTRA:
      </p>
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-8 border-indigo-400 shadow-2xl flex items-center justify-center overflow-hidden p-4 relative">
        {image && (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain animate-pulse"
          />
        )}
      </div>
      <span className="text-lg font-black text-slate-800 bg-white/80 px-3 py-1 rounded-lg">
        {name.toUpperCase()} {/* Ahora es seguro porque validamos el if(!name) arriba */}
      </span>
    </div>
  );
};