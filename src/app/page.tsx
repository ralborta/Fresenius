'use client';

import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaPhone, FaClock, FaCheckCircle, FaTimesCircle, FaRegClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardIsabela() {
  // Estado para los datos del backend
  const [apiData, setApiData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/estadisticas-isabela")
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los datos del dashboard");
        setLoading(false);
      });
  }, []);

  // Métricas relevantes del API con iconos y mapeo correcto
  const metricasDashboard = [
    { key: 'total_calls', label: 'Total Calls', icon: <FaPhone className="text-sky-500 text-2xl" /> },
    { key: 'total_minutes', label: 'Total Minutes', icon: <FaClock className="text-sky-500 text-2xl" /> },
    { key: 'exitosas', label: 'Successful', icon: <FaCheckCircle className="text-green-500 text-2xl" /> },
    { key: 'fallidas', label: 'Failed', icon: <FaTimesCircle className="text-red-500 text-2xl" /> },
    { key: 'desconocidas', label: 'Unknown', icon: <FaRegClock className="text-sky-500 text-2xl" /> },
    // Puedes agregar más métricas aquí si el API las devuelve
  ];

  // Datos para la gráfica Call Monitor (ajusta el campo según tu JSON real)
  const callMonitorData = Array.isArray(apiData?.callMonitorData)
    ? apiData.callMonitorData
    : [{ name: '10:00', active: 0, onHold: 0 }];

  // Datos para Service Level y velocímetro (ajusta los campos según tu JSON real)
  const serviceLevel = apiData?.serviceLevel ?? '55/18';
  const serviceLevelLabel = apiData?.serviceLevelLabel ?? '76/19 Service Level - Today';
  const waiting = apiData?.waiting ?? 0;
  const active = apiData?.active ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-0">
      <div className="w-full max-w-6xl flex items-center justify-between mt-4 mb-8">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-wide" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Dashboard Fresenius</h1>
        <img src="/Logo_IA_Empresa.png" alt="IA Solutions Logo" className="max-h-10 w-auto ml-4 mr-2 mt-1" style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} />
      </div>
      {loading && <p className="text-gray-500">Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
            {metricasDashboard.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white rounded-xl shadow border border-blue-100 p-4 min-h-[110px]">
                <div className="mb-2">{m.icon}</div>
                <div className="text-sm text-gray-500 font-medium text-center mb-1">{m.label}</div>
                <div className="text-2xl font-bold text-sky-700">{apiData && apiData[m.key] !== undefined && apiData[m.key] !== null ? String(apiData[m.key]) : '0'}</div>
              </div>
            ))}
          </div>
          {/* Gráfica y paneles inferiores */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
            {/* Gráfica Call Monitor */}
            <div className="col-span-2 bg-white rounded-xl shadow border border-blue-100 p-4 flex flex-col">
              <div className="font-semibold text-lg text-gray-700 mb-2">Call Monitor</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={callMonitorData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#0284c7" strokeWidth={2} name="Active Calls" />
                  <Line type="monotone" dataKey="onHold" stroke="#f43f5e" strokeWidth={2} name="On Hold" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Indicadores visuales */}
            <div className="flex flex-col gap-6">
              {/* Service Level */}
              <div className="bg-white rounded-xl shadow border border-blue-100 p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-1">{String(serviceLevelLabel)}</div>
                <FaExclamationTriangle className="text-yellow-400 text-3xl mb-1" />
                <div className="text-3xl font-bold text-gray-700">{String(serviceLevel)}</div>
                <div className="text-xs text-gray-400">% Answered Within SLA</div>
              </div>
              {/* Velocímetro (gauge) */}
              <div className="bg-white rounded-xl shadow border border-blue-100 p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-1">Currently Active & Waiting</div>
                {/* Simulación de velocímetro */}
                <div className="relative w-28 h-14 flex items-end justify-center">
                  <svg width="112" height="56" viewBox="0 0 112 56">
                    <path d="M8,56 A48,48 0 0,1 104,56" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <path d="M8,56 A48,48 0 0,1 80,20" fill="none" stroke="#22c55e" strokeWidth="10" />
                  </svg>
                  <div className="absolute left-0 right-0 bottom-2 flex justify-between px-2 text-xs text-gray-400">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">Waiting: {String(waiting)}</div>
                <div className="text-2xl font-bold text-green-600">Active: {String(active)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
