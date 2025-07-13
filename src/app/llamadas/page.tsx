"use client";

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
  telefono_destino?: string;
  nombre_paciente?: string;
  producto?: string;
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-0">
      <div className="w-full flex justify-center mb-8 mt-8">
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide text-center w-full" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>
            Listado de Llamadas
          </h1>
        </div>
      </div>
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 border border-gray-200">
        {loading && <p className="text-gray-500">Cargando llamadas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className={`${showModal ? 'filter blur-sm pointer-events-none select-none' : ''} w-full flex flex-col items-center`}>
          {conversations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="px-4 py-2 font-semibold">ID</th>
                    <th className="px-4 py-2 font-semibold">Agente</th>
                    <th className="px-4 py-2 font-semibold">Paciente</th>
                    <th className="px-4 py-2 font-semibold">Producto</th>
                    <th className="px-4 py-2 font-semibold">Teléfono</th>
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
                          setLoadingSummary(true);
                          try {
                            const res = await fetch(`/api/llamada-detalle/${c.conversation_id}`);
                            const data = await res.json();
                            // Buscar el resumen en analysis.transcript_summary
                            const resumen = data.analysis?.transcript_summary || data.summary || data.call_summary || data.overview || data.description || null;
                            if (resumen && resumen.trim()) {
                              // Traducir automáticamente al español usando MyMemory
                              try {
                                const tradRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(resumen)}&langpair=en|es`);
                                const tradData = await tradRes.json();
                                if (tradData.responseData && tradData.responseData.translatedText) {
                                  setSelectedSummary(tradData.responseData.translatedText);
                                } else {
                                  setSelectedSummary('No se pudo traducir el resumen');
                                }
                              } catch {
                                setSelectedSummary('No se pudo traducir el resumen');
                              }
                            } else {
                              setSelectedSummary(null);
                            }
                          } catch {
                            setSelectedSummary(null);
                          }
                          setLoadingSummary(false);
                        }}
                      >
                        <td className="px-4 py-2 text-gray-700 font-mono">{correlativo}</td>
                        <td className="px-4 py-2 text-gray-700">{c.agent_name || '-'}</td>
                        <td className="px-4 py-2 text-gray-700">{c.nombre_paciente || '-'}</td>
                        <td className="px-4 py-2 text-gray-700">{c.producto || '-'}</td>
                        <td className="px-4 py-2 text-gray-700">{c.telefono_destino || '-'}</td>
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
          ) : (
            !loading && <p className="text-gray-400">No hay llamadas registradas.</p>
          )}
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
      </div>
      {/* Modal para mostrar el resumen de la llamada */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 relative animate-fade-in-up flex flex-col items-center border border-blue-100">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-700 text-xl font-bold focus:outline-none"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-3 text-blue-900 w-full text-left">Resumen de la llamada</h2>
            <div className="text-gray-700 whitespace-pre-line w-full min-h-[40px] text-base mb-3">
              {loadingSummary ? (
                <span className="italic text-gray-400">Generando análisis IA Services...</span>
              ) : selectedSummary ? (
                selectedSummary
              ) : (
                <span className="italic text-gray-400">Sin resumen disponible</span>
              )}
            </div>
            <div className="mt-4 flex justify-end w-full">
              <button
                className="px-5 py-1.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-base"
                onClick={() => setShowModal(false)}
              >Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 