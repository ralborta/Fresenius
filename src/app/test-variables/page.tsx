'use client';

import { useState } from 'react';
import { FaBug, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function TestVariables() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [stockPrevisto, setStockPrevisto] = useState('');
  const [fechaEnvio, setFechaEnvio] = useState('');
  const [producto, setProducto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  // IDs hardcodeados para prueba
  const AGENT_ID = "agent_01jyqdepnrf1x9wfrt9kkyy84t";
  const AGENT_PHONE_NUMBER_ID = "phnum_01jzmyvs1sf49rvgy1vcdrfnd3";

  const handleTestVariables = async () => {
    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      const response = await fetch('/api/test-variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          agentId: AGENT_ID,
          agentPhoneNumberId: AGENT_PHONE_NUMBER_ID,
          variables: {
            nombre_paciente: nombrePaciente,
            stock_teorico: stockPrevisto,
            fecha_envio: fechaEnvio,
            producto: producto
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTestResult(data);
      } else {
        setError(data.error || 'Error en el test');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-wide mb-4">
            Test Variables Dinámicas
          </h1>
          <p className="text-gray-600 text-lg">
            Diagnóstico de variables dinámicas para ElevenLabs
          </p>
        </div>

        {/* Formulario de prueba */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos de Prueba</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de teléfono
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+5491123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del paciente
              </label>
              <input
                type="text"
                value={nombrePaciente}
                onChange={(e) => setNombrePaciente(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock previsto
              </label>
              <input
                type="text"
                value={stockPrevisto}
                onChange={(e) => setStockPrevisto(e.target.value)}
                placeholder="150 unidades"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de envío
              </label>
              <input
                type="text"
                value={fechaEnvio}
                onChange={(e) => setFechaEnvio(e.target.value)}
                placeholder="15 de enero"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto
              </label>
              <input
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                placeholder="Medicamento X"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleTestVariables}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Probando variables...
              </>
            ) : (
              <>
                <FaBug />
                Test Variables Dinámicas
              </>
            )}
          </button>
        </div>

        {/* Resultados del test */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaTimesCircle className="text-red-500 text-xl" />
              <div>
                <h3 className="font-semibold text-red-900">Error en el test</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {testResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-green-500 text-xl" />
              <h3 className="font-semibold text-green-900">Test completado exitosamente</h3>
            </div>
            
            <div className="space-y-4">
              {/* Información de debug */}
              <div>
                <h4 className="font-medium text-green-800 mb-2">Información de Debug:</h4>
                <div className="bg-white rounded p-3 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.debug_info, null, 2)}</pre>
                </div>
              </div>

              {/* Variables recibidas */}
              <div>
                <h4 className="font-medium text-green-800 mb-2">Variables Recibidas:</h4>
                <div className="bg-white rounded p-3 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.variables_recibidas, null, 2)}</pre>
                </div>
              </div>

              {/* Variables normalizadas */}
              <div>
                <h4 className="font-medium text-green-800 mb-2">Variables Normalizadas:</h4>
                <div className="bg-white rounded p-3 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.variables_normalizadas, null, 2)}</pre>
                </div>
              </div>

              {/* Payload simulado */}
              <div>
                <h4 className="font-medium text-green-800 mb-2">Payload Simulado:</h4>
                <div className="bg-white rounded p-3 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.payload_simulado, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 