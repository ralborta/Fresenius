'use client';

import { useEffect, useState } from "react";

interface Conversation {
  call_duration_secs?: number;
  call_successful?: string;
  created_at?: string;
  conversation_id?: string;
  summary?: string;
}

export default function LlamadasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/estadisticas-isabela")
      .then((res) => res.json())
      .then((data) => {
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las llamadas");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-0">
      <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide mb-8 mt-4" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Listado de Llamadas</h1>
      {loading && <p className="text-gray-500">Cargando llamadas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {conversations.length > 0 ? (
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 mb-10 border border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-50 text-blue-900">
                  <th className="px-4 py-2 font-semibold">Fecha/Hora</th>
                  <th className="px-4 py-2 font-semibold">Duración (seg)</th>
                  <th className="px-4 py-2 font-semibold">Estado</th>
                  <th className="px-4 py-2 font-semibold">ID Conversación</th>
                  <th className="px-4 py-2 font-semibold">Resumen</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c, idx) => (
                  <tr key={c.conversation_id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"}>
                    <td className="px-4 py-2 text-gray-700">{c.created_at ? new Date(c.created_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-blue-700 font-semibold">{c.call_duration_secs ?? '-'}</td>
                    <td className="px-4 py-2">{c.call_successful ?? '-'}</td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-500">{c.conversation_id ?? '-'}</td>
                    <td className="px-4 py-2 max-w-xs truncate text-gray-600">{c.summary ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-gray-400">No hay llamadas registradas.</p>
      )}
    </div>
  );
} 