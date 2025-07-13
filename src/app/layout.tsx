import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { MdDashboard, MdCall, MdBarChart, MdMonitorHeart, MdSettings } from "react-icons/md";
import { useState } from 'react';
import { FaCog, FaPhone, FaUserFriends, FaPhoneAlt, FaFileUpload, FaTachometerAlt, FaChartBar, FaListAlt, FaEye } from 'react-icons/fa';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plataforma VoiceCall",
  description: "Dashboard Fresenius",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [configOpen, setConfigOpen] = useState(false);
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        <div className="flex min-h-screen">
          {/* Menú lateral */}
          <aside className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col p-4">
            <div className="mb-8 text-2xl font-bold text-blue-900">
              Plataforma <span className="text-blue-500">VoiceCall</span>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
              <a href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-semibold">
                <FaTachometerAlt className="text-blue-500" /> Dashboard
              </a>
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
          {/* Contenido principal */}
          <main className="flex-1 bg-white p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
