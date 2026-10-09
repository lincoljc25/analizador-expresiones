// src/lib/compiler/types.ts

export type TokenType = 'NUMBER' | 'VARIABLE' | 'OPERATOR' | 'PAREN_LEFT' | 'PAREN_RIGHT';

export interface Token {
  type: TokenType;
  value: string;
}

export interface Cuadruplo {
  operator: string;
  arg1: string;
  arg2: string;
  result: string; // Ej: "T1"
}

export interface Triplo {
  index: number;   // (0), (1), (2)...
  operator: string;
  arg1: string;
  arg2: string;
}

export interface CompilerResult {
  postfix: string[];
  cuadruplos: Cuadruplo[];
  triplos: Triplo[];
  error?: string;
}