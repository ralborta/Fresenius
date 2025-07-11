'use client';

import { useEffect, useState } from "react";

interface Conversation {
  call_duration_secs?: number;
  call_successful?: string;
  created_at?: string;
  conversation_id?: string;
  summary?: string;
}

const PAGE_SIZE = 10;

export default function LlamadasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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

  // Paginación
  const totalPages = Math.ceil(conversations.length / PAGE_SIZE);
  const paginatedConversations = conversations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                  {(Object.keys(conversations[0] || {}) as (keyof Conversation)[]).map((key) => (
                    <th key={key} className="px-4 py-2 font-semibold">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedConversations.map((c, idx) => (
                  <tr key={c.conversation_id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"}>
                    {(Object.keys(conversations[0] || {}) as (keyof Conversation)[]).map((key) => (
                      <td key={key} className="px-4 py-2 text-gray-700">{String(c[key] ?? '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded font-semibold ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-200'}`}
                  onClick={() => setPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >Siguiente</button>
            </div>
          )}
        </div>
      ) : (
        !loading && <p className="text-gray-400">No hay llamadas registradas.</p>
      )}
    </div>
  );
} 