'use client';

import { useEffect, useState } from "react";

interface Estadisticas {
  total_calls?: number;
  total_minutes?: number;
  rejected_calls?: number;
  unanswered_calls?: number;
  busy_calls?: number;
  failed_calls?: number;
  [key: string]: unknown;
}

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
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
            <span className="text-gray-500">Llamadas Rechazadas</span>
            <span className="text-2xl font-bold">{stats.rejected_calls ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">No Contestadas</span>
            <span className="text-2xl font-bold">{stats.unanswered_calls ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Ocupadas</span>
            <span className="text-2xl font-bold">{stats.busy_calls ?? '-'}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-500">Fallidas</span>
            <span className="text-2xl font-bold">{stats.failed_calls ?? '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
