'use client';

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Conversation {
  call_duration_secs?: number;
  call_successful?: string;
  created_at?: string;
  conversation_id?: string;
  summary?: string;
  // otros campos si los necesitas
}

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
  conversations?: Conversation[];
  [key: string]: number | Conversation[] | undefined;
}

const INDICADORES = [
  {
    key: 'total_calls',
    label: 'Total Calls',
    color: 'from-blue-500 via-blue-400 to-blue-700',
    pathColor: '#3b82f6',
    textColor: '#fff',
    shadow: 'shadow-blue-900/40',
  },
  {
    key: 'total_minutes',
    label: 'Total Minutes',
    color: 'from-cyan-500 via-cyan-400 to-cyan-700',
    pathColor: '#06b6d4',
    textColor: '#fff',
    shadow: 'shadow-cyan-900/40',
  },
  {
    key: 'exitosas',
    label: 'Successful',
    color: 'from-emerald-500 via-emerald-400 to-emerald-700',
    pathColor: '#10b981',
    textColor: '#fff',
    shadow: 'shadow-emerald-900/40',
  },
  {
    key: 'fallidas',
    label: 'Failed',
    color: 'from-orange-500 via-orange-400 to-orange-700',
    pathColor: '#f59e0b',
    textColor: '#fff',
    shadow: 'shadow-orange-900/40',
  },
];

export default function DashboardIsabela() {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/estadisticas-isabela")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las estadísticas");
        setLoading(false);
      });
  }, []);

  // Calcular promedio de duración de llamada
  const promedioDuracion = stats && stats.total_calls && stats.total_calls > 0
    ? Math.round(((stats.total_minutes ?? 0) * 60) / stats.total_calls)
    : 0;

  // Porcentajes
  const porcentajeExito = stats && stats.total_calls && stats.total_calls > 0
    ? Math.round(((stats.exitosas ?? 0) / stats.total_calls) * 100)
    : 0;
  const porcentajeFallo = stats && stats.total_calls && stats.total_calls > 0
    ? Math.round(((stats.fallidas ?? 0) / stats.total_calls) * 100)
    : 0;

  // Duración máxima y mínima
  // Suponiendo que stats.conversations es un array de llamadas
  let duracionMax = 0;
  let duracionMin = 0;
  if (stats && Array.isArray(stats.conversations) && stats.conversations.length > 0) {
    const duraciones = stats.conversations.map((c: Conversation) => c.call_duration_secs || 0);
    duracionMax = Math.max(...duraciones);
    duracionMin = Math.min(...duraciones);
  }

  // Calcular llamadas rechazadas
  const rechazadas = stats && Array.isArray(stats.conversations)
    ? stats.conversations.filter((c: Conversation) => c.call_successful === 'rejected').length
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-0">
      <h1 className="text-4xl font-bold mb-8 mt-4 text-gray-800 drop-shadow">Dashboard Fresenius</h1>
      {loading && <p className="text-gray-500">Cargando estadísticas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {stats && (
        <>
          {/* Indicadores principales arriba */}
          <div className="flex flex-row gap-8 mb-12 mt-2 flex-wrap justify-center">
            {INDICADORES.map((ind) => (
              <div
                key={ind.key}
                className={`w-64 h-64 rounded-2xl bg-white flex flex-col items-center justify-center shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200`}
              >
                <span className="text-xl font-semibold text-blue-700 mb-2 drop-shadow">{ind.label}</span>
                <div className="w-36 h-36 mb-2">
                  <CircularProgressbar
                    value={stats[ind.key] as number ?? 0}
                    maxValue={ind.key === 'total_minutes' ? 500 : stats.total_calls ?? 100}
                    text={`${stats[ind.key] ?? '-'}`}
                    styles={buildStyles({
                      pathColor: '#38bdf8', // celeste suave
                      textColor: '#0ea5e9', // celeste
                      trailColor: '#e0f2fe',
                      textSize: '2.5rem',
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sección de métricas de tiempo y calidad */}
          <div className="flex flex-row flex-wrap gap-8 mb-10 justify-center">
            <div className="w-64 h-40 rounded-2xl bg-blue-50 flex flex-col items-center justify-center shadow border border-blue-100">
              <span className="text-lg font-semibold text-blue-700 mb-1">Total Minutos</span>
              <span className="text-4xl font-bold text-blue-500">{stats.total_minutes ?? '-'}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-cyan-50 flex flex-col items-center justify-center shadow border border-cyan-100">
              <span className="text-lg font-semibold text-cyan-700 mb-1">Promedio duración (seg)</span>
              <span className="text-4xl font-bold text-cyan-500">{promedioDuracion}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-amber-50 flex flex-col items-center justify-center shadow border border-amber-100">
              <span className="text-lg font-semibold text-amber-700 mb-1">Llamadas Rechazadas</span>
              <span className="text-4xl font-bold text-amber-500">{rechazadas}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-emerald-50 flex flex-col items-center justify-center shadow border border-emerald-100">
              <span className="text-lg font-semibold text-emerald-700 mb-1">% Éxito</span>
              <span className="text-4xl font-bold text-emerald-500">{porcentajeExito}%</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-red-50 flex flex-col items-center justify-center shadow border border-red-100">
              <span className="text-lg font-semibold text-red-700 mb-1">% Fallo</span>
              <span className="text-4xl font-bold text-red-500">{porcentajeFallo}%</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center shadow border border-indigo-100">
              <span className="text-lg font-semibold text-indigo-700 mb-1">Duración Máxima (seg)</span>
              <span className="text-4xl font-bold text-indigo-500">{duracionMax}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-violet-50 flex flex-col items-center justify-center shadow border border-violet-100">
              <span className="text-lg font-semibold text-violet-700 mb-1">Duración Mínima (seg)</span>
              <span className="text-4xl font-bold text-violet-500">{duracionMin}</span>
            </div>
          </div>

          {/* Listado de llamadas */}
        </>
      )}
    </div>
  );
}
