// src/features/game-board/components/VisualItem.tsx
import { Billboard, Image } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

interface VisualItemProps {
  url: string;
  position: [number, number, number];
  onClick: () => void;
}

export const VisualItem = ({ url, position, onClick }: VisualItemProps) => {
  return (
    <Billboard position={position}>
      <Image 
        url={url} 
        transparent 
        scale={[1.5, 1.5]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation(); // Evita que el clic atraviese varios objetos
          onClick();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
    </Billboard>
  );
};