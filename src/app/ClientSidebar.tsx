"use client";
import { useState } from 'react';
import { FaCog, FaPhone, FaUserFriends, FaPhoneAlt, FaFileUpload, FaTachometerAlt, FaChartBar, FaListAlt, FaEye } from 'react-icons/fa';
import Link from "next/link";

export function ClientSidebar() {
  const [configOpen, setConfigOpen] = useState(false);
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 via-white to-blue-100 border-r border-blue-100 flex flex-col p-4 shadow-md">
      <div className="mb-8 text-2xl font-extrabold text-blue-900 tracking-wide flex items-center gap-2 select-none">
        <span className="inline-block bg-blue-100 rounded-full p-2"><FaTachometerAlt className="text-blue-500 text-xl" /></span>
        <span>Plataforma <span className="text-blue-500">VoiceCall</span></span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-blue-100 text-blue-900 group">
          <span className="bg-sky-100 group-hover:bg-sky-200 rounded-full p-2 transition-all"><FaTachometerAlt className="text-sky-500 text-lg" /></span> Dashboard
        </Link>
        <a href="/llamadas" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-blue-100 text-blue-900 group">
          <span className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 transition-all"><FaListAlt className="text-blue-500 text-lg" /></span> Llamadas
        </a>
        <a href="/stats" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-blue-100 text-blue-900 group">
          <span className="bg-green-100 group-hover:bg-green-200 rounded-full p-2 transition-all"><FaChartBar className="text-green-500 text-lg" /></span> Stats
        </a>
        <a href="/monitoring" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-blue-100 text-blue-900 group">
          <span className="bg-yellow-100 group-hover:bg-yellow-200 rounded-full p-2 transition-all"><FaEye className="text-yellow-500 text-lg" /></span> Monitoring
        </a>
        {/* Grupo Configuración */}
        <div>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold w-full focus:outline-none transition-all hover:bg-blue-100 text-blue-900 group"
            onClick={() => setConfigOpen((open) => !open)}
            aria-expanded={configOpen}
          >
            <span className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-2 transition-all"><FaCog className="text-purple-500 text-lg" /></span> Configuración
            <span className="ml-auto text-xs">{configOpen ? '▲' : '▼'}</span>
          </button>
          {configOpen && (
            <div className="ml-8 mt-2 flex flex-col gap-1">
              <a href="/test-call" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 group">
                <span className="bg-sky-100 group-hover:bg-sky-200 rounded-full p-1 transition-all"><FaPhone className="text-sky-400 text-base" /></span> Llamadas
              </a>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default group" disabled>
                <span className="bg-blue-100 rounded-full p-1"><FaUserFriends className="text-blue-400 text-base" /></span> Agentes
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default group" disabled>
                <span className="bg-blue-100 rounded-full p-1"><FaPhoneAlt className="text-blue-400 text-base" /></span> Números de teléfono
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default group" disabled>
                <span className="bg-blue-100 rounded-full p-1"><FaFileUpload className="text-blue-400 text-base" /></span> Subir archivo
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
} 