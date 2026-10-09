// src/app/page.tsx
'use client';

import { useState } from 'react';
import { tokenize } from '@/lib/compiler/lexer';
import { infixToPostfix } from '@/lib/compiler/parser';
import { generateIntermediateCode } from '@/lib/compiler/generator';
import { evaluatePostfix } from '@/lib/compiler/evaluator';
import { CompilerResult } from '@/lib/compiler/types';

export default function Home() {
  const [expression, setExpression] = useState('(A + B) * (C - D) / E');
  const [result, setResult] = useState<CompilerResult | null>(null);
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [numericResult, setNumericResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      setResult(null);
      setNumericResult(null);
      setVariables({});

      // 1. Tokenizar
      const tokens = tokenize(expression);

      // 2. Convertir a Postfija
      const postfix = infixToPostfix(tokens);

      // 3. Generar Cuádruplos y Tríos
      const { cuadruplos, triplos } = generateIntermediateCode(postfix);

      setResult({ postfix, cuadruplos, triplos });

      // 4. Detectar variables y asignar valores por defecto
      const vars: Record<string, number> = {};
      postfix.forEach((t) => {
        if (/^[A-Z]$/.test(t)) vars[t] = 1;
      });
      setVariables(vars);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEvaluate = () => {
    if (!result) return;
    try {
      setError(null);
      const evalResult = evaluatePostfix(result.postfix, variables);
      setNumericResult(evalResult);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-cyan-400">
          Analizador de Expresiones Aritméticas
        </h1>

        {/* INPUT PRINCIPAL */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Ingresa la expresión infija:
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="flex-1 p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500 text-white font-mono"
              placeholder="Ej: (A + B) * (C - D) / E"
            />
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-bold transition-colors"
            >
              Analizar
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm font-bold bg-red-900/30 p-3 rounded-lg">
              ⚠️ {error}
            </p>
          )}
        </div>

        {result && (
          <div className="space-y-6">
            {/* NOTACIÓN POSTFIJA */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-3 text-cyan-400">
                1. Notación Polaca Inversa (Postfija)
              </h2>
              <p className="font-mono text-lg bg-slate-900 p-4 rounded-lg border border-slate-700">
                {result.postfix.join(' ')}
              </p>
            </div>

            {/* TABLA DE CUÁDRUPLOS */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                2. Tabla de Cuádruplos
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-700 text-slate-200">
                      <th className="p-3 border border-slate-600">Operador</th>
                      <th className="p-3 border border-slate-600">Argumento 1</th>
                      <th className="p-3 border border-slate-600">Argumento 2</th>
                      <th className="p-3 border border-slate-600">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.cuadruplos.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-700/50">
                        <td className="p-3 border border-slate-700 font-mono text-cyan-300">
                          {c.operator}
                        </td>
                        <td className="p-3 border border-slate-700 font-mono">{c.arg1}</td>
                        <td className="p-3 border border-slate-700 font-mono">{c.arg2}</td>
                        <td className="p-3 border border-slate-700 font-mono text-green-400">
                          {c.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA DE TRÍOS */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                3. Tabla de Tríos
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-700 text-slate-200">
                      <th className="p-3 border border-slate-600">Índice</th>
                      <th className="p-3 border border-slate-600">Operador</th>
                      <th className="p-3 border border-slate-600">Argumento 1</th>
                      <th className="p-3 border border-slate-600">Argumento 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.triplos.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-700/50">
                        <td className="p-3 border border-slate-700 font-mono text-yellow-400">
                          ({t.index})
                        </td>
                        <td className="p-3 border border-slate-700 font-mono text-cyan-300">
                          {t.operator}
                        </td>
                        <td className="p-3 border border-slate-700 font-mono">{t.arg1}</td>
                        <td className="p-3 border border-slate-700 font-mono">{t.arg2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VARIABLES Y EVALUACIÓN */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                4. Cálculo Numérico
              </h2>

              {Object.keys(variables).length > 0 ? (
                <>
                  <p className="text-sm text-slate-400 mb-4">
                    Asigna valores a las variables detectadas:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {Object.entries(variables).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="font-mono text-lg text-yellow-400 w-8">
                          {key}:
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              [key]: Number(e.target.value),
                            })
                          }
                          className="flex-1 p-2 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleEvaluate}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
                  >
                    Calcular Resultado
                  </button>
                </>
              ) : (
                <p className="text-slate-400">
                  No hay variables. Presiona "Calcular" para evaluar la expresión directamente.
                </p>
              )}

              {numericResult !== null && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
                  <p className="text-sm text-green-300 mb-1">Resultado:</p>
                  <p className="text-3xl font-mono text-green-400 font-bold">
                    {numericResult}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}