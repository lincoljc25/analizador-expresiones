// src/lib/compiler/generator.ts
import { Cuadruplo, Triplo } from './types';

const OPERATORS = ['+', '-', '*', '/', '^'];

export function generateIntermediateCode(postfix: string[]): {
  cuadruplos: Cuadruplo[];
  triplos: Triplo[];
} {
  // ---- GENERACIÓN DE CUÁDRUPLOS ----
  const cuadruplos: Cuadruplo[] = [];
  const stackCuad: string[] = [];
  let tempCount = 1;

  for (const token of postfix) {
    if (OPERATORS.includes(token)) {
      const arg2 = stackCuad.pop()!;
      const arg1 = stackCuad.pop()!;
      const result = `T${tempCount++}`;

      cuadruplos.push({ operator: token, arg1, arg2, result });
      stackCuad.push(result);
    } else {
      stackCuad.push(token);
    }
  }

  // ---- GENERACIÓN DE TRÍOS ----
  // En los tríos, los resultados se referencian por índice: (0), (1), (2)...
  const triplos: Triplo[] = [];
  const stackTri: string[] = [];
  let tripleCount = 0;

  for (const token of postfix) {
    if (OPERATORS.includes(token)) {
      const arg2 = stackTri.pop()!;
      const arg1 = stackTri.pop()!;

      triplos.push({
        index: tripleCount,
        operator: token,
        arg1,
        arg2,
      });

      // El resultado de este trío se referencia con su índice entre paréntesis
      stackTri.push(`(${tripleCount})`);
      tripleCount++;
    } else {
      stackTri.push(token);
    }
  }

  return { cuadruplos, triplos };
}