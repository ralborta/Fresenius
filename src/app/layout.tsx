import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { MdDashboard, MdCall, MdBarChart, MdMonitorHeart, MdSettings } from "react-icons/md";
import { ClientSidebar } from "./ClientSidebar";
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
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        <div className="flex min-h-screen">
          {/* Menú lateral */}
          <ClientSidebar />
          {/* Contenido principal */}
          <main className="flex-1 bg-white p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
