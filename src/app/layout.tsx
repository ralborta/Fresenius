import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { MdDashboard, MdCall, MdBarChart, MdMonitorHeart, MdSettings } from "react-icons/md";

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
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar celeste suave */}
          <aside className="w-64 bg-[#e0f2fe] border-r border-[#bae6fd] flex flex-col justify-between py-8 px-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <span className="text-2xl font-bold text-sky-700">Plataforma</span>
                <span className="text-2xl font-bold text-sky-400">VoiceCall</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-900 font-medium bg-gradient-to-r from-sky-200/90 to-sky-100/80 shadow-md">
                  <MdDashboard className="text-2xl" /> Dashboard
                </Link>
                <Link href="/llamadas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-700 hover:bg-sky-100 font-medium">
                  <MdCall className="text-2xl" /> Llamadas
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-700 hover:bg-sky-100 font-medium">
                  <MdBarChart className="text-2xl" /> Stats
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-700 hover:bg-sky-100 font-medium">
                  <MdMonitorHeart className="text-2xl" /> Monitoring
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-700 hover:bg-sky-100 font-medium">
                  <MdSettings className="text-2xl" /> Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sky-200 mt-8">
              <span className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center font-bold text-sky-900 text-xl">R</span>
              <div>
                <div className="font-semibold text-sky-900">Raúl</div>
                <div className="text-xs text-sky-700">Admin</div>
              </div>
            </div>
          </aside>
          {/* Contenido principal */}
          <main className="flex-1 p-6 bg-white">
            <nav className="w-full flex justify-end items-center gap-6 px-8 py-4 bg-white shadow-sm border-b border-blue-100">
              <Link href="/" className="text-blue-900 font-semibold hover:text-blue-600 transition">Dashboard</Link>
              <Link href="/gestion-llamadas" className="text-blue-900 font-semibold hover:text-blue-600 transition">Gestión de Llamadas</Link>
            </nav>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
