'use client';

import { useState } from 'react';

export default function DebugSimple() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testDebug = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/debug-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: '+5491123456789',
          agentId: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
          agentPhoneNumberId: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
          variables: {
            nombre_paciente: 'Juan Pérez',
            producto: 'Medicamento X',
            stock_teorico: '150 unidades',
            fecha_envio: '15 de enero'
          }
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Debug Simple - Variables Dinámicas</h1>
        
        <button
          onClick={testDebug}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Probando...' : 'Probar Debug Simple'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
            <h3 className="font-bold text-red-800">Error:</h3>
            <pre className="text-red-700 mt-2">{error}</pre>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Resultado Completo:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Variables Recibidas:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(result.debug_info?.variables_received, null, 2)}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Payload Enviado a ElevenLabs:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result.payload_sent, null, 2)}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Respuesta de ElevenLabs:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result.elevenlabs_response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 