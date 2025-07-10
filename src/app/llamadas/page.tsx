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
    <div className="min-h-screen flex flex-col items-center justify-start bg-transparent p-0">
      <h1 className="text-4xl font-bold text-white mb-8 mt-4 drop-shadow">Listado de Llamadas</h1>
      {loading && <p>Cargando llamadas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {conversations.length > 0 ? (
        <div className="w-full max-w-6xl bg-[#18122B] rounded-2xl shadow-lg p-6 mb-10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-white">
              <thead>
                <tr className="bg-[#232046]">
                  <th className="px-4 py-2">Fecha/Hora</th>
                  <th className="px-4 py-2">Duración (seg)</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">ID Conversación</th>
                  <th className="px-4 py-2">Resumen</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c, idx) => (
                  <tr key={c.conversation_id || idx} className="border-b border-[#232046] hover:bg-[#232046]/60">
                    <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">{c.call_duration_secs ?? '-'}</td>
                    <td className="px-4 py-2">{c.call_successful ?? '-'}</td>
                    <td className="px-4 py-2 font-mono text-xs">{c.conversation_id ?? '-'}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{c.summary ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-gray-300">No hay llamadas registradas.</p>
      )}
    </div>
  );
} 