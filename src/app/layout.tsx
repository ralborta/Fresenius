import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a] text-white`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar azul profesional */}
          <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col justify-between py-8 px-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <span className="text-2xl font-bold text-blue-400">Plataforma</span>
                <span className="text-2xl font-bold text-white">VoiceCall</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600/80 to-blue-500/60 shadow-md">
                  <span className="text-lg">🎛️</span> Dashboard
                </Link>
                <Link href="/llamadas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] font-medium">
                  <span className="text-lg">📞</span> Llamadas
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] font-medium">
                  <span className="text-lg">📊</span> Stats
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] font-medium">
                  <span className="text-lg">🩺</span> Monitoring
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] font-medium">
                  <span className="text-lg">⚙️</span> Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#334155] mt-8">
              <span className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-[#1e293b] text-xl">R</span>
              <div>
                <div className="font-semibold text-white">Raúl</div>
                <div className="text-xs text-blue-300">Admin</div>
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
