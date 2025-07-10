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
          {/* Sidebar celeste oscuro */}
          <aside className="w-64 bg-[#2563eb] border-r border-[#1e40af] flex flex-col justify-between py-8 px-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <span className="text-2xl font-bold text-white">Plataforma</span>
                <span className="text-2xl font-bold text-blue-200">VoiceCall</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-700/90 to-blue-500/80 shadow-md">
                  <MdDashboard className="text-2xl" /> Dashboard
                </Link>
                <Link href="/llamadas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-600 font-medium">
                  <MdCall className="text-2xl" /> Llamadas
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-600 font-medium">
                  <MdBarChart className="text-2xl" /> Stats
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-600 font-medium">
                  <MdMonitorHeart className="text-2xl" /> Monitoring
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-600 font-medium">
                  <MdSettings className="text-2xl" /> Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-800 mt-8">
              <span className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-800 text-xl">R</span>
              <div>
                <div className="font-semibold text-white">Raúl</div>
                <div className="text-xs text-blue-200">Admin</div>
              </div>
            </div>
          </aside>
          {/* Contenido principal */}
          <main className="flex-1 p-10 bg-transparent">{children}</main>
        </div>
      </body>
    </html>
  );
}
