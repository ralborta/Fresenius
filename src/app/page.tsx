'use client';

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Estadisticas {
  total_calls?: number;
  total_minutes?: number;
  exitosas?: number;
  fallidas?: number;
  desconocidas?: number;
  rejected_calls?: number;
  unanswered_calls?: number;
  busy_calls?: number;
  failed_calls?: number;
  [key: string]: number | undefined;
}

const INDICADORES = [
  {
    key: 'total_calls',
    label: 'Total Calls',
    color: 'from-pink-500 via-fuchsia-500 to-pink-700',
    pathColor: '#f472b6',
    textColor: '#fff',
    shadow: 'shadow-pink-900/40',
  },
  {
    key: 'total_minutes',
    label: 'Total Minutes',
    color: 'from-blue-500 via-blue-400 to-blue-700',
    pathColor: '#38bdf8',
    textColor: '#fff',
    shadow: 'shadow-blue-900/40',
  },
  {
    key: 'exitosas',
    label: 'Successful',
    color: 'from-green-500 via-emerald-500 to-green-700',
    pathColor: '#34d399',
    textColor: '#fff',
    shadow: 'shadow-green-900/40',
  },
  {
    key: 'fallidas',
    label: 'Failed',
    color: 'from-orange-500 via-amber-500 to-orange-700',
    pathColor: '#f59e42',
    textColor: '#fff',
    shadow: 'shadow-orange-900/40',
  },
];

export default function DashboardIsabela() {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contador, setContador] = useState(0);

  useEffect(() => {
    fetch("/api/estadisticas-isabela")
      .then((res) => res.json())
      .then((data) => {
        console.log('Respuesta de la API /api/estadisticas-isabela:', data); // Log temporal
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las estadísticas");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="mb-4 flex flex-col items-center">
        <span className="text-lg font-semibold">Contador de prueba: {contador}</span>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setContador(contador + 1)}
        >
          Incrementar
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Dashboard de Isabela</h1>
      {loading && <p>Cargando estadísticas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {stats && (
        <div className="flex flex-row gap-8 mb-10">
          {INDICADORES.map((ind) => (
            <div
              key={ind.key}
              className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${ind.color} flex flex-col items-center justify-center shadow-xl ${ind.shadow}`}
            >
              <span className="text-xl font-semibold text-white mb-2 drop-shadow">{ind.label}</span>
              <div className="w-36 h-36 mb-2">
                <CircularProgressbar
                  value={stats[ind.key] as number ?? 0}
                  maxValue={ind.key === 'total_minutes' ? 500 : stats.total_calls ?? 100}
                  text={`${stats[ind.key] ?? '-'}`}
                  styles={buildStyles({
                    pathColor: ind.pathColor,
                    textColor: ind.textColor,
                    trailColor: 'rgba(255,255,255,0.08)',
                    textSize: '2.5rem',
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
