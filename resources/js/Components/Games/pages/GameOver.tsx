export const GameOver = ({ score, reason }: { score: number, reason: string }) => {
  return (
    <div className="w-screen h-screen bg-indigo-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Icono o ilustración superior */}
        <div className="text-8xl animate-bounce">
          {reason === "timeout" ? "⏰" : "❌"}
        </div>

        <h1 className="text-6xl font-black tracking-tighter italic">
          FIN DEL JUEGO
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-2">
            Puntuación Obtenida
          </p>
          <p className="text-7xl font-black text-white leading-none">
            {score}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-5 rounded-2xl text-2xl shadow-[0_8px_0_rgb(190,18,60)] active:translate-y-1 active:shadow-none transition-all"
          >
            ¿OTRA VEZ?
          </button>

          <button
            onClick={() => window.location.href = '/'} // O volver al menú principal
            className="w-full bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            VOLVER AL MENÚ
          </button>
        </div>

        <p className="text-indigo-300 text-sm italic">
          {reason === "timeout"
            ? "¡Se te acabó el tiempo! Tienes que ser más rápido."
            : "¡Cuidado! Has cometido demasiados errores."}
        </p>
      </div>
    </div>
  );
};
