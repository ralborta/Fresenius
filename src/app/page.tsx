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
    { key: 'total_calls', label: 'Total Calls', icon: <FaPhone />, color: 'sky' },
    { key: 'total_minutes', label: 'Total Minutes', icon: <FaClock />, color: 'blue' },
    { key: 'exitosas', label: 'Successful', icon: <FaCheckCircle />, color: 'green' },
    { key: 'fallidas', label: 'Failed', icon: <FaTimesCircle />, color: 'red' },
    { key: 'desconocidas', label: 'Unknown', icon: <FaRegClock />, color: 'yellow' },
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
    <div className="min-h-screen flex flex-row items-start justify-center bg-gray-50">
      {/* Menú lateral */}
      <div className="mr-2 mt-8">
        {/* El menú se renderiza desde ClientSidebar */}
      </div>
      {/* Contenido central: encabezado flotante + dashboard */}
      <div className="flex flex-col items-center justify-start w-full max-w-7xl mt-8">
        {/* Encabezado flotante */}
        <div className="w-full flex justify-center mb-8">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-3xl w-full">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-wide" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Dashboard Fresenius</h1>
            <img src="/Logo_IA_Empresa.png" alt="IA Solutions Logo" className="max-h-10 w-auto ml-4 mr-2 mt-1" style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} />
          </div>
        </div>
        {/* Panel central */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {loading && <p className="text-gray-500">Cargando datos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              {/* Tarjetas de métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-8">
                {metricasDashboard.map((m, i) => {
                  // Paleta de colores sutiles
                  const colorMap: Record<string, string> = {
                    sky: 'text-sky-600 bg-sky-50',
                    blue: 'text-blue-600 bg-blue-50',
                    green: 'text-green-600 bg-green-50',
                    red: 'text-red-500 bg-red-50',
                    yellow: 'text-yellow-500 bg-yellow-50',
                  };
                  const iconBg = colorMap[m.color] || 'text-slate-500 bg-slate-100';
                  const numberColor = colorMap[m.color]?.split(' ')[0] || 'text-slate-700';
                  return (
                    <div
                      key={i}
                      className={
                        `flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 p-5 min-h-[120px] transition-all duration-200 hover:shadow-md hover:bg-white shadow-[0_8px_32px_0_rgba(139,92,246,0.15)]`
                      }
                    >
                      <div className={`mb-2 rounded-full p-2 ${iconBg} text-3xl`}>{m.icon}</div>
                      <div className="text-xs text-gray-500 font-medium text-center mb-1 tracking-wide uppercase">{m.label}</div>
                      <div className={`text-3xl font-extrabold ${numberColor}`}>{apiData && apiData[m.key] !== undefined && apiData[m.key] !== null ? String(apiData[m.key]) : '0'}</div>
                    </div>
                  );
                })}
              </div>
              {/* Línea divisoria azul moderna */}
              <div className="w-full h-1 rounded-full bg-gradient-to-r from-blue-400/60 via-blue-500/80 to-purple-400/60 mb-8 opacity-80" />
              {/* Gráfica y paneles inferiores */}
              <div className="grid grid-cols-3 gap-6 w-full">
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
      </div>
    </div>
  );
}
