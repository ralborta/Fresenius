'use client';

import { useEffect, useState } from "react";

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Llamadas Totales</span>
            <span className="text-2xl font-bold">{stats.total_calls ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Minutos Totales</span>
            <span className="text-2xl font-bold">{stats.total_minutes ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Llamadas Exitosas</span>
            <span className="text-2xl font-bold">{stats.exitosas ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Llamadas Fallidas</span>
            <span className="text-2xl font-bold">{stats.fallidas ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Desconocidas</span>
            <span className="text-2xl font-bold">{stats.desconocidas ?? '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
