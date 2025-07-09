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
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8 w-full max-w-6xl">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-2">
              <CircularProgressbar
                value={stats.total_calls ?? 0}
                maxValue={200}
                text={`${stats.total_calls ?? '-'}`}
                styles={buildStyles({
                  pathColor: '#2563eb',
                  textColor: '#2563eb',
                  trailColor: '#e0e7ef',
                  textSize: '1.5rem',
                })}
              />
            </div>
            <span className="text-gray-700 font-semibold">Llamadas Totales</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-2">
              <CircularProgressbar
                value={stats.total_minutes ?? 0}
                maxValue={500}
                text={`${stats.total_minutes ?? '-'}`}
                styles={buildStyles({
                  pathColor: '#059669',
                  textColor: '#059669',
                  trailColor: '#e0e7ef',
                  textSize: '1.5rem',
                })}
              />
            </div>
            <span className="text-gray-700 font-semibold">Minutos Totales</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-2">
              <CircularProgressbar
                value={stats.exitosas ?? 0}
                maxValue={stats.total_calls ?? 100}
                text={`${stats.exitosas ?? '-'}`}
                styles={buildStyles({
                  pathColor: '#22c55e',
                  textColor: '#22c55e',
                  trailColor: '#e0e7ef',
                  textSize: '1.5rem',
                })}
              />
            </div>
            <span className="text-gray-700 font-semibold">Exitosas</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-2">
              <CircularProgressbar
                value={stats.fallidas ?? 0}
                maxValue={stats.total_calls ?? 100}
                text={`${stats.fallidas ?? '-'}`}
                styles={buildStyles({
                  pathColor: '#ef4444',
                  textColor: '#ef4444',
                  trailColor: '#e0e7ef',
                  textSize: '1.5rem',
                })}
              />
            </div>
            <span className="text-gray-700 font-semibold">Fallidas</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-2">
              <CircularProgressbar
                value={stats.desconocidas ?? 0}
                maxValue={stats.total_calls ?? 100}
                text={`${stats.desconocidas ?? '-'}`}
                styles={buildStyles({
                  pathColor: '#64748b',
                  textColor: '#64748b',
                  trailColor: '#e0e7ef',
                  textSize: '1.5rem',
                })}
              />
            </div>
            <span className="text-gray-700 font-semibold">Desconocidas</span>
          </div>
        </div>
      )}
    </div>
  );
}
