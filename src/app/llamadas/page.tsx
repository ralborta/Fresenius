'use client';

import { useEffect, useState } from "react";

interface Conversation {
  agent_id?: string;
  agent_name?: string;
  conversation_id?: string;
  start_time_unix_secs?: number;
  call_duration_secs?: number;
  message_count?: number;
  status?: string;
  call_successful?: string;
  summary?: string;
}

const PAGE_SIZE = 10;

export default function LlamadasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [detalleLlamada, setDetalleLlamada] = useState<unknown>(null);
  const [conversationIdUsado, setConversationIdUsado] = useState<string | null>(null);

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
                  <th className="px-4 py-2 font-semibold">ID</th>
                  <th className="px-4 py-2 font-semibold">Agente</th>
                  <th className="px-4 py-2 font-semibold">Estatus</th>
                  <th className="px-4 py-2 font-semibold">Fecha y hora</th>
                  <th className="px-4 py-2 font-semibold">Resultado</th>
                  <th className="px-4 py-2 font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody>
                {paginatedConversations.map((c, idx) => {
                  // ID correlativo global
                  const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                  const correlativo = `Nt-${globalIdx.toString().padStart(3, '0')}`;
                  // Fecha legible
                  const fecha = c.start_time_unix_secs ? new Date(Number(c.start_time_unix_secs) * 1000) : null;
                  const fechaStr = fecha ? fecha.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '-';
                  // Duración en mm:ss
                  const dur = c.call_duration_secs || 0;
                  const min = Math.floor(dur / 60);
                  const seg = dur % 60;
                  const duracionStr = `${min}:${seg.toString().padStart(2, '0')}`;
                  return (
                    <tr
                      key={c.conversation_id || idx}
                      className={idx % 2 === 0 ? "bg-white cursor-pointer" : "bg-blue-50/60 cursor-pointer"}
                      onClick={async () => {
                        setShowModal(true);
                        setSelectedSummary(null);
                        setDetalleLlamada(null);
                        setConversationIdUsado(c.conversation_id || null);
                        setLoadingSummary(true);
                        try {
                          const res = await fetch(`/api/llamada-detalle/${c.conversation_id}`);
                          const data = await res.json();
                          setDetalleLlamada(data);
                          // Intenta encontrar el campo de resumen más probable
                          const resumen = data.summary || data.call_summary || data.overview || data.description || null;
                          setSelectedSummary(resumen && resumen.trim() ? resumen : null);
                        } catch {
                          setSelectedSummary(null);
                          setDetalleLlamada(null);
                        }
                        setLoadingSummary(false);
                      }}
                    >
                      <td className="px-4 py-2 text-gray-700 font-mono">{correlativo}</td>
                      <td className="px-4 py-2 text-gray-700">{c.agent_name || '-'}</td>
                      <td className="px-4 py-2 text-gray-700">{c.status || '-'}</td>
                      <td className="px-4 py-2 text-gray-700">{fechaStr}</td>
                      <td className="px-4 py-2 text-gray-700">{c.call_successful || '-'}</td>
                      <td className="px-4 py-2 text-gray-700">{duracionStr}</td>
                    </tr>
                  );
                })}
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
      {/* Modal para mostrar el resumen de la llamada */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-900 w-full text-left">Resumen de la llamada</h2>
            {conversationIdUsado && (
              <div className="w-full text-xs text-gray-500 mb-2">ID usado para detalle: <span className="font-mono">{conversationIdUsado}</span></div>
            )}
            <div className="text-gray-700 whitespace-pre-line w-full min-h-[60px] text-lg mb-4">
              {loadingSummary ? (
                <span className="italic text-gray-400">Cargando resumen...</span>
              ) : selectedSummary ? (
                selectedSummary
              ) : (
                <span className="italic text-gray-400">Sin resumen disponible</span>
              )}
            </div>
            {/* DEPURACIÓN: Mostrar el JSON completo de la respuesta */}
            {typeof detalleLlamada === 'object' && detalleLlamada !== null && (
              <div className="w-full bg-blue-50 rounded p-3 text-xs text-gray-700 overflow-x-auto mb-4">
                <div className="font-bold mb-1">Respuesta completa del detalle:</div>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(detalleLlamada, null, 2)}</pre>
              </div>
            )}
            <div className="mt-8 flex justify-end w-full">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                onClick={() => setShowModal(false)}
              >Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 