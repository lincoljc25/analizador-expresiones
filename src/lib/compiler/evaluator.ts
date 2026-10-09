// src/lib/compiler/evaluator.ts

export function evaluatePostfix(
  postfix: string[],
  variables: Record<string, number>
): number {
  const stack: number[] = [];

  for (const token of postfix) {
    // Si es un número, lo metemos a la pila
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    }
    // Si es una variable, buscamos su valor
    else if (variables[token] !== undefined) {
      stack.push(variables[token]);
    }
    // Si es un operador, sacamos dos valores y operamos
    else if (['+', '-', '*', '/', '^'].includes(token)) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result = 0;

      switch (token) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
          if (b === 0) throw new Error('División por cero');
          result = a / b;
          break;
        case '^': result = Math.pow(a, b); break;
      }
      stack.push(result);
    }
    // Si no es nada de lo anterior, es una variable sin valor asignado
    else {
      throw new Error(`Variable no definida: ${token}`);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Expresión inválida');
  }

  return stack[0];
}