// src/features/game-board/components/Scene.tsx
import { Canvas } from '@react-three/fiber';
import { VisualItem } from './VisualItem';

export const Scene = ({ objects, onItemClick }: { objects: any[], onItemClick: (id: string) => void }) => {
  if (!objects) return null;

  return (
    /* El contenedor DEBE tener una altura definida (h-full) para que el Canvas aparezca */
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        // Eliminamos el style manual para que use el contenedor
      >
        <ambientLight intensity={0.8} />
        {objects.map((obj) => (
          <VisualItem
            key={obj.id}
            url={obj.url}
            position={obj.position}
            onClick={() => onItemClick(obj.id)}
          />
        ))}
      </Canvas>
    </div>
  );
};
