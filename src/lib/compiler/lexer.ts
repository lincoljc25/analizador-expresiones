// src/lib/compiler/lexer.ts
import { Token } from './types';

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Ignorar espacios en blanco
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Números (enteros o decimales)
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Variables (letras A-Z)
    if (/[a-zA-Z]/.test(char)) {
      tokens.push({ type: 'VARIABLE', value: char.toUpperCase() });
      i++;
      continue;
    }

    // Operadores
    if (['+', '-', '*', '/', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Paréntesis
    if (char === '(') {
      tokens.push({ type: 'PAREN_LEFT', value: char });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'PAREN_RIGHT', value: char });
      i++;
      continue;
    }

    // Si llegamos aquí, hay un carácter inválido
    throw new Error(`Carácter inválido: ${char}`);
  }

  return tokens;
}