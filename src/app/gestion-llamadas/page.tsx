"use client";

import React, { useState } from 'react';

export default function GestionLlamadasPage() {
  const [numeroDestino, setNumeroDestino] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const agentPhoneNumberId = 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3';
  const agente = 'Isabela';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);
    // Aquí iría la lógica para llamar al backend o API de ElevenLabs
    setTimeout(() => {
      setEnviando(false);
      setResultado('Llamada enviada (simulado)');
    }, 1200);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Gestión de Llamadas</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1">Agente</label>
          <input type="text" value={agente} disabled className="w-full px-3 py-2 rounded border border-blue-200 bg-blue-50 text-blue-900 font-semibold" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1">Agent Phone Number ID</label>
          <input type="text" value={agentPhoneNumberId} disabled className="w-full px-3 py-2 rounded border border-blue-200 bg-blue-50 text-blue-900 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1">Número destino</label>
          <input type="tel" required value={numeroDestino} onChange={e => setNumeroDestino(e.target.value)} placeholder="Ej: +5491122334455" className="w-full px-3 py-2 rounded border border-blue-200 focus:border-blue-400 outline-none" />
        </div>
        <button type="submit" disabled={enviando || !numeroDestino} className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Lanzar llamada'}
        </button>
        {resultado && <div className="text-green-600 font-semibold mt-2">{resultado}</div>}
      </form>
      <div className="mt-8 p-4 bg-blue-50 rounded text-xs text-blue-900">
        <div className="font-bold mb-2">Endpoint:</div>
        <code className="block mb-2">POST https://api.elevenlabs.io/v1/convai/batch-calling/submit</code>
        <div className="font-bold mb-1">Payload ejemplo:</div>
        <pre className="bg-white rounded p-2 border border-blue-100 overflow-x-auto">
{`{
  "agent_phone_number_id": "${agentPhoneNumberId}",
  "agent_id": "(ID del agente)",
  "destination": "${numeroDestino || '+5491122334455'}"
}`}
        </pre>
      </div>
    </div>
  );
} 