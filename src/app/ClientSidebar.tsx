"use client";
import { useState } from 'react';
import { FaCog, FaPhone, FaUserFriends, FaPhoneAlt, FaFileUpload, FaTachometerAlt, FaChartBar, FaListAlt, FaEye } from 'react-icons/fa';
import Link from "next/link";

export function ClientSidebar() {
  const [configOpen, setConfigOpen] = useState(false);
  return (
    <aside className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col p-4">
      <div className="mb-8 text-2xl font-bold text-blue-900">
        Plataforma <span className="text-blue-500">VoiceCall</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold">
          <FaTachometerAlt className="text-blue-500" /> Dashboard
        </Link>
        <a href="/llamadas" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold">
          <FaListAlt className="text-blue-500" /> Llamadas
        </a>
        <a href="/stats" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold">
          <FaChartBar className="text-blue-500" /> Stats
        </a>
        <a href="/monitoring" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold">
          <FaEye className="text-blue-500" /> Monitoring
        </a>
        {/* Grupo Configuración */}
        <div>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold w-full focus:outline-none"
            onClick={() => setConfigOpen((open) => !open)}
            aria-expanded={configOpen}
          >
            <FaCog className="text-blue-500" /> Configuración
            <span className="ml-auto text-xs">{configOpen ? '▲' : '▼'}</span>
          </button>
          {configOpen && (
            <div className="ml-8 mt-2 flex flex-col gap-1">
              <a href="/test-call" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800">
                <FaPhone className="text-blue-400" /> Llamadas
              </a>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default" disabled>
                <FaUserFriends className="text-blue-400" /> Agentes
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default" disabled>
                <FaPhoneAlt className="text-blue-400" /> Números de teléfono
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 text-blue-800 cursor-default" disabled>
                <FaFileUpload className="text-blue-400" /> Subir archivo
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
} 