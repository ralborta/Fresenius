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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#181818] text-white`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar oscuro */}
          <aside className="w-64 bg-[#1A1536] border-r border-[#28224a] flex flex-col justify-between py-8 px-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <span className="text-2xl font-bold text-fuchsia-400">Plataforma</span>
                <span className="text-2xl font-bold text-white">VoiceCall</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-fuchsia-700/80 to-fuchsia-500/60 shadow-md">
                  <span className="text-lg">🎛️</span> Dashboard
                </Link>
                <Link href="/llamadas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#232046] font-medium">
                  <span className="text-lg">📞</span> Llamadas
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#232046] font-medium">
                  <span className="text-lg">📊</span> Stats
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#232046] font-medium">
                  <span className="text-lg">🩺</span> Monitoring
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#232046] font-medium">
                  <span className="text-lg">⚙️</span> Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#232046] mt-8">
              <span className="w-10 h-10 rounded-full bg-fuchsia-400 flex items-center justify-center font-bold text-[#1A1536] text-xl">R</span>
              <div>
                <div className="font-semibold text-white">Raúl</div>
                <div className="text-xs text-fuchsia-300">Admin</div>
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
