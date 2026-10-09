// src/lib/compiler/parser.ts
import { Token } from './types';

// Jerarquía de operadores (mayor número = mayor prioridad)
const PRECEDENCE: Record<string, number> = {
  '^': 3,
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
};

// Operadores asociativos por la derecha (como la potencia)
const RIGHT_ASSOCIATIVE = ['^'];

export function infixToPostfix(tokens: Token[]): string[] {
  const output: string[] = [];   // Cola de salida
  const stack: Token[] = [];     // Pila de operadores

  for (const token of tokens) {
    // 1. Si es un número o variable, va directo a la salida
    if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
      output.push(token.value);
    }

    // 2. Si es un operador, comparamos precedencia con el tope de la pila
    else if (token.type === 'OPERATOR') {
      while (
        stack.length > 0 &&
        stack[stack.length - 1].type === 'OPERATOR' &&
        (PRECEDENCE[stack[stack.length - 1].value] > PRECEDENCE[token.value] ||
          (PRECEDENCE[stack[stack.length - 1].value] === PRECEDENCE[token.value] &&
            !RIGHT_ASSOCIATIVE.includes(token.value)))
      ) {
        output.push(stack.pop()!.value);
      }
      stack.push(token);
    }

    // 3. Si es paréntesis izquierdo, lo metemos a la pila
    else if (token.type === 'PAREN_LEFT') {
      stack.push(token);
    }

    // 4. Si es paréntesis derecho, sacamos todo hasta encontrar el izquierdo
    else if (token.type === 'PAREN_RIGHT') {
      while (stack.length > 0 && stack[stack.length - 1].type !== 'PAREN_LEFT') {
        output.push(stack.pop()!.value);
      }
      if (stack.length === 0) {
        throw new Error('Paréntesis desbalanceados: falta un "("');
      }
      stack.pop(); // Descartamos el paréntesis izquierdo
    }
  }

  // 5. Vaciamos lo que quede en la pila
  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.type === 'PAREN_LEFT') {
      throw new Error('Paréntesis desbalanceados: falta un ")"');
    }
    output.push(top.value);
  }

  return output;
}