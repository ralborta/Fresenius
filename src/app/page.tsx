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
    <div className="min-h-screen flex flex-col items-center justify-start bg-transparent p-0">
      <h1 className="text-4xl font-bold mb-8 mt-4 drop-shadow text-white">Dashboard Fresenius</h1>
      {loading && <p>Cargando estadísticas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {stats && (
        <>
          {/* Indicadores principales arriba */}
          <div className="flex flex-row gap-8 mb-12 mt-2">
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

          {/* Sección de métricas de tiempo y calidad */}
          <div className="flex flex-row flex-wrap gap-8 mb-10 justify-center">
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">Total Minutos</span>
              <span className="text-4xl font-bold text-blue-300">{stats.total_minutes ?? '-'}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-fuchsia-900 via-fuchsia-800 to-fuchsia-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">Promedio duración (seg)</span>
              <span className="text-4xl font-bold text-fuchsia-200">{promedioDuracion}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">Llamadas Rechazadas</span>
              <span className="text-4xl font-bold text-yellow-200">{rechazadas}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">% Éxito</span>
              <span className="text-4xl font-bold text-green-200">{porcentajeExito}%</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">% Fallo</span>
              <span className="text-4xl font-bold text-red-200">{porcentajeFallo}%</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">Duración Máxima (seg)</span>
              <span className="text-4xl font-bold text-cyan-200">{duracionMax}</span>
            </div>
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-700 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-semibold text-white mb-1">Duración Mínima (seg)</span>
              <span className="text-4xl font-bold text-yellow-200">{duracionMin}</span>
            </div>
          </div>

          {/* Listado de llamadas */}
          {Array.isArray(stats.conversations) && stats.conversations.length > 0 && (
            <div className="w-full max-w-6xl bg-[#18122B] rounded-2xl shadow-lg p-6 mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">Listado de Llamadas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-white">
                  <thead>
                    <tr className="bg-[#232046]">
                      <th className="px-4 py-2">Fecha/Hora</th>
                      <th className="px-4 py-2">Duración (seg)</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">ID Conversación</th>
                      <th className="px-4 py-2">Resumen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.conversations.map((c: Conversation, idx: number) => (
                      <tr key={c.conversation_id || idx} className="border-b border-[#232046] hover:bg-[#232046]/60">
                        <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleString() : '-'}</td>
                        <td className="px-4 py-2">{c.call_duration_secs ?? '-'}</td>
                        <td className="px-4 py-2">{c.call_successful ?? '-'}</td>
                        <td className="px-4 py-2 font-mono text-xs">{c.conversation_id ?? '-'}</td>
                        <td className="px-4 py-2 max-w-xs truncate">{c.summary ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
