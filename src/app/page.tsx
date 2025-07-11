'use client';

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaClock, FaPhone, FaCalendarAlt, FaUserCheck, FaUserFriends, FaChartLine, FaUserTimes, FaExclamationTriangle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Datos simulados para las tarjetas
const metricas = [
  { label: 'Longest Call Waiting', value: '01:10', icon: <FaClock className="text-sky-500 text-2xl" /> },
  { label: 'Current Call Waiting', value: 11, icon: <FaPhone className="text-sky-500 text-2xl" /> },
  { label: 'Average Talk Time', value: '5:22', icon: <FaCalendarAlt className="text-sky-500 text-2xl" /> },
  { label: 'Total Calls Today', value: 2321, icon: <FaChartLine className="text-sky-500 text-2xl" /> },
  { label: 'Agent Ready', value: 4, icon: <FaUserCheck className="text-sky-500 text-2xl" /> },
  { label: 'Agent Logged In', value: 34, icon: <FaUserFriends className="text-sky-500 text-2xl" /> },
  { label: 'ASA', value: 43, icon: <FaChartLine className="text-sky-500 text-2xl" /> },
  { label: 'Abandoned Today', value: 6, icon: <FaUserTimes className="text-sky-500 text-2xl" /> },
];

// Datos simulados para la gráfica de líneas
const callMonitorData = [
  { name: '10:00', active: 70, onHold: 20 },
  { name: '10:10', active: 76, onHold: 22 },
  { name: '10:20', active: 72, onHold: 19 },
  { name: '10:30', active: 80, onHold: 25 },
  { name: '10:40', active: 74, onHold: 21 },
  { name: '10:50', active: 78, onHold: 23 },
  { name: '11:00', active: 75, onHold: 20 },
];

export default function DashboardIsabela() {
  // Estado para los datos del backend
  const [apiData, setApiData] = useState<any>(null);
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

  // Mapear los datos del API a las tarjetas (ajusta los campos según tu JSON real)
  const metricas = apiData ? [
    { label: 'Longest Call Waiting', value: apiData.longestCallWaiting ?? '-', icon: <FaClock className="text-sky-500 text-2xl" /> },
    { label: 'Current Call Waiting', value: apiData.currentCallWaiting ?? '-', icon: <FaPhone className="text-sky-500 text-2xl" /> },
    { label: 'Average Talk Time', value: apiData.averageTalkTime ?? '-', icon: <FaCalendarAlt className="text-sky-500 text-2xl" /> },
    { label: 'Total Calls Today', value: apiData.totalCallsToday ?? '-', icon: <FaChartLine className="text-sky-500 text-2xl" /> },
    { label: 'Agent Ready', value: apiData.agentReady ?? '-', icon: <FaUserCheck className="text-sky-500 text-2xl" /> },
    { label: 'Agent Logged In', value: apiData.agentLoggedIn ?? '-', icon: <FaUserFriends className="text-sky-500 text-2xl" /> },
    { label: 'ASA', value: apiData.asa ?? '-', icon: <FaChartLine className="text-sky-500 text-2xl" /> },
    { label: 'Abandoned Today', value: apiData.abandonedToday ?? '-', icon: <FaUserTimes className="text-sky-500 text-2xl" /> },
  ] : [];

  // Datos para la gráfica Call Monitor (ajusta el campo según tu JSON real)
  const callMonitorData = apiData?.callMonitorData ?? [
    { name: '10:00', active: 0, onHold: 0 },
  ];

  // Datos para Service Level y velocímetro (ajusta los campos según tu JSON real)
  const serviceLevel = apiData?.serviceLevel ?? '55/18';
  const serviceLevelLabel = apiData?.serviceLevelLabel ?? '76/19 Service Level - Today';
  const waiting = apiData?.waiting ?? 0;
  const active = apiData?.active ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-0">
      <h1 className="text-4xl font-bold mb-8 mt-4 text-gray-800 drop-shadow">Dashboard Fresenius</h1>
      {loading && <p className="text-gray-500">Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-4 gap-6 w-full max-w-6xl mb-8">
            {metricas.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white rounded-xl shadow border border-blue-100 p-4 min-h-[110px]">
                <div className="mb-2">{m.icon}</div>
                <div className="text-2xl font-bold text-sky-700">{m.value}</div>
                <div className="text-sm text-gray-500 font-medium text-center">{m.label}</div>
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
                <div className="text-sm text-gray-500 font-medium mb-1">{serviceLevelLabel}</div>
                <FaExclamationTriangle className="text-yellow-400 text-3xl mb-1" />
                <div className="text-3xl font-bold text-gray-700">{serviceLevel}</div>
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
                <div className="text-xs text-gray-400">Waiting: {waiting}</div>
                <div className="text-2xl font-bold text-green-600">Active: {active}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
