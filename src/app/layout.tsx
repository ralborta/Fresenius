import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plataforma Isabela",
  description: "Dashboard de llamadas de Isabela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r flex flex-col justify-between py-6 px-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <span className="text-2xl font-bold text-blue-700">Plataforma</span>
                <span className="text-2xl font-bold text-yellow-500">Isabela</span>
              </div>
              <nav className="flex flex-col gap-2">
                <a href="/" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 font-medium">
                  <span>🏠</span> Dashboard
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 font-medium">
                  <span>📞</span> Llamadas
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded bg-gray-100">
              <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">R</span>
              <div>
                <div className="font-semibold text-gray-700">Raúl</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
          </aside>
          {/* Contenido principal */}
          <main className="flex-1 p-8 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
