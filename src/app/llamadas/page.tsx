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
  nombre_paciente?: string; // Added for patient name
  telefono_destino?: string; // Added for phone number
  producto?: string; // Added for product
}

interface ConversationDetail {
  telefono_destino?: string;
  nombre_paciente?: string;
  producto?: string;
}

const PAGE_SIZE = 10;

async function traducirTexto(texto: string): Promise<string> {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texto,
        source: "en",
        target: "es",
        format: "text"
      })
    });
    const data = await res.json();
    return data.translatedText || texto;
  } catch {
    return texto;
  }
}

export default function LlamadasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail | null>(null);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/estadisticas-isabela');
      if (!response.ok) {
        throw new Error('Error al cargar las conversaciones');
      }
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetail = async (conversationId: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/llamada-detalle/${conversationId}`);
      if (!response.ok) {
        throw new Error('Error al cargar los detalles');
      }
      const data = await response.json();
      
      // Extraer los datos de los campos correctos
      const telefono_destino = data.metadata?.phone_call?.external_number || 
                              data.conversation_initiation_client_data?.dynamic_variables?.system__called_number || 
                              'No disponible';
      
      let nombre_paciente = data.conversation_initiation_client_data?.dynamic_variables?.nombre_paciente || 
                           'No disponible';
      
      // Si el nombre es exactamente "Leonardo Viano", mostrar solo "Leonardo"
      if (nombre_paciente === 'Leonardo Viano') {
        nombre_paciente = 'Leonardo';
      }
      
      const producto = data.conversation_initiation_client_data?.dynamic_variables?.producto || 
                      'No disponible';

      setConversationDetail({
        telefono_destino,
        nombre_paciente,
        producto
      });
    } catch (err) {
      console.error('Error al cargar detalles:', err);
      setConversationDetail({
        telefono_destino: 'Error al cargar',
        nombre_paciente: 'Error al cargar',
        producto: 'Error al cargar'
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (selectedSummary) {
      setTranslating(true);
      const traducido = await traducirTexto(selectedSummary);
      setTranslatedSummary(traducido);
      setTranslating(false);
    }
  };

  const handleRowClick = async (conversation: Conversation) => {
    setSelectedSummary(conversation.summary || null);
    setTranslatedSummary(null);
    
    if (conversation.conversation_id) {
      await fetchConversationDetail(conversation.conversation_id);
    }
  };

  const closeModal = () => {
    setSelectedSummary(null);
    setTranslatedSummary(null);
    setConversationDetail(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando llamadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchConversations}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedConversations = conversations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(conversations.length / PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-0">
      <div className="w-full flex justify-center mb-8 mt-8">
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide text-center w-full" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Listado de Llamadas</h1>
        </div>
      </div>

      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-2 font-semibold">Paciente</th>
                <th className="px-4 py-2 font-semibold">Producto</th>
                <th className="px-4 py-2 font-semibold">Teléfono</th>
                <th className="px-4 py-2 font-semibold">Fecha y hora</th>
                <th className="px-4 py-2 font-semibold">Duración</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConversations.map((conversation, index) => (
                <tr 
                  key={conversation.conversation_id || index}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(conversation)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {conversation.nombre_paciente === 'Leonardo Viano' ? 'Leonardo' : (conversation.nombre_paciente || 'N/A')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {conversation.producto || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {conversation.telefono_destino || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {conversation.start_time_unix_secs ? formatDate(conversation.start_time_unix_secs) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {conversation.call_duration_secs ? formatDuration(conversation.call_duration_secs) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-blue-900 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-blue-900 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal para mostrar detalles */}
      {selectedSummary !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Detalles de la Llamada</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando detalles...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationDetail && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">Paciente</h3>
                      <p className="text-gray-900">{conversationDetail.nombre_paciente}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">Producto</h3>
                      <p className="text-gray-900">{conversationDetail.producto}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-2">Teléfono</h3>
                      <p className="text-gray-900">{conversationDetail.telefono_destino}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Resumen de la Llamada</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {translatedSummary !== null ? translatedSummary : selectedSummary}
                  </p>
                  {selectedSummary && !translatedSummary && (
                    <button
                      onClick={handleTranslate}
                      className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                      disabled={translating}
                    >
                      {translating ? 'Traduciendo...' : 'Traducir al español'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 