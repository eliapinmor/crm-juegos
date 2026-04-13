// src/features/game-board/utils/levelGenerator.ts
import { v4 as uuidv4 } from "uuid";
import { inventoryGroups } from "../data/inventory";

export const prepareLevel = () => {
  const groupKeys = Object.keys(inventoryGroups);
  const selectedKey = groupKeys[
    Math.floor(Math.random() * groupKeys.length)
  ] as keyof typeof inventoryGroups;
  const pool = inventoryGroups[selectedKey];

  // 1. Separamos el que será el TARGET de los demás (DISTRACTORES)
  const targetIndexInPool = Math.floor(Math.random() * pool.length);
  const targetTemplate = pool[targetIndexInPool];

  // Creamos la lista de distractores (todos menos el elegido como target)
  const distractorTemplates = pool.filter(
    (_, index) => index !== targetIndexInPool,
  );

  const objects = [];
  const rows = 5;
  const cols = 5;
  const spacingX = 2;
  const spacingY = 2;

  // 2. Creamos todas las posiciones posibles en la cuadrícula
  const positions: [number, number, number][] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - (cols - 1) / 2) * spacingX;
      const y = (i - (rows - 1) / 2) * spacingY;
      positions.push([x, y, 0]);
    }
  }

  // 3. Mezclamos las posiciones para que el target no esté siempre en el mismo sitio
  positions.sort(() => Math.random() - 0.5);

  // 4. Asignamos la primera posición al TARGET ÚNICO
  const targetPosition = positions.pop()!;
  const target = {
    ...targetTemplate,
    id: uuidv4(),
    isTarget: true,
    position: targetPosition,
  };
  objects.push(target);

  // 5. Rellenamos el resto de posiciones con DISTRACTORES aleatorios
  positions.forEach((pos) => {
    const randomDistractor =
      distractorTemplates[
        Math.floor(Math.random() * distractorTemplates.length)
      ];
    objects.push({
      ...randomDistractor,
      id: uuidv4(),
      isTarget: false,
      position: pos,
    });
  });

  return {
    target,
    allObjects: objects, // Ya no hace falta mezclar aquí, las posiciones ya se mezclaron
  };
};
