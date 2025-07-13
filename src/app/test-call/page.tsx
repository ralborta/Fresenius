'use client';

import { useState } from 'react';
import { FaPhone, FaSpinner, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

// Definir tipo para los detalles de la llamada
type CallDetails = {
  batch_call_id?: string;
  status?: string;
  conversation_id?: string;
  timestamp?: string;
  [key: string]: unknown;
};

export default function TestCall() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'initiating' | 'success' | 'error'>('idle');
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  // Estados para los nuevos campos
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [stockPrevisto, setStockPrevisto] = useState('');
  const [fechaEnvio, setFechaEnvio] = useState('');
  const [producto, setProducto] = useState('');
  const nombreOperador = 'Isabela';

  // IDs hardcodeados
  const AGENT_ID = "agent_01jyqdepnrf1x9wfrt9kkyy84t";
  const AGENT_PHONE_NUMBER_ID = "phnum_01jzmyvs1sf49rvgy1vcdrfnd3";

  // Log para depuración
  console.log('AGENT_ID:', AGENT_ID, 'PHONE_ID:', AGENT_PHONE_NUMBER_ID);

  const handleTestCall = async () => {
    if (!phoneNumber.trim()) {
      setErrorMessage('Por favor ingresa un número de teléfono');
      return;
    }

    setIsLoading(true);
    setCallStatus('initiating');
    setErrorMessage('');
    setCallDetails(null);

    try {
      // Paso 1: Iniciar la llamada de prueba
      const callResponse = await fetch('/api/test-call', {
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
            stock_previsto: stockPrevisto,
            fecha_envio: fechaEnvio,
            producto: producto,
            nombre_operador: nombreOperador
          }
        }),
      });

      if (!callResponse.ok) {
        throw new Error('Error al iniciar la llamada de prueba');
      }

      const callData = await callResponse.json();
      setCallDetails(callData);

      if (callData.batch_call_id) {
        setCallStatus('success');
        setCallDetails(callData);
        // Iniciar polling para verificar el estado de la llamada
        startPolling(callData.batch_call_id);
        console.log('Llamada iniciada con batch_call_id:', callData.batch_call_id);
      } else {
        throw new Error('No se recibió batch_call_id');
      }

    } catch (error) {
      console.error('Error en la llamada de prueba:', error);
      setCallStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = async (batchCallId: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // Máximo 5 minutos (30 * 10 segundos)

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/test-call?batch_call_id=${batchCallId}`);
        
        if (response.ok) {
          const data = await response.json();
          setCallDetails(prev => ({ ...prev, ...data }));

          // Si la llamada está completada o falló, detener el polling
          if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
            setIsPolling(false);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          // Continuar polling cada 10 segundos
          setTimeout(pollStatus, 10000);
        } else {
          setIsPolling(false);
          console.log('Polling detenido después de máximo intentos');
        }
      } catch (error) {
        console.error('Error en polling:', error);
        setIsPolling(false);
      }
    };

    // Iniciar el primer poll después de 5 segundos
    setTimeout(pollStatus, 5000);
  };

  const getStatusIcon = () => {
    switch (callStatus) {
      case 'initiating':
        return <FaSpinner className="animate-spin text-blue-500 text-2xl" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      default:
        return <FaPhone className="text-sky-500 text-2xl" />;
    }
  };

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'initiating':
        return 'Iniciando llamada de prueba...';
      case 'success':
        return 'Llamada de prueba iniciada exitosamente';
      case 'error':
        return 'Error al iniciar la llamada de prueba';
      default:
        return 'Listo para hacer una llamada de prueba';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-6">
      <div className="w-full max-w-2xl">
        {/* Línea de depuración visual */}
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded font-mono text-sm">
          DEBUG: {AGENT_ID} - {AGENT_PHONE_NUMBER_ID}
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-wide mb-4">
            Test Call
          </h1>
          <p className="text-gray-600 text-lg">
            Realiza llamadas de prueba usando la API de ElevenLabs
          </p>
        </div>

        {/* Panel de información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Información de la llamada de prueba</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Agente: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{AGENT_ID}</span></li>
                <li>• Número del agente: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{AGENT_PHONE_NUMBER_ID}</span></li>
                <li>• La llamada se realizará usando el endpoint batch-calling/submit</li>
                <li>• Recibirás un batch_call_id para hacer seguimiento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Número de teléfono de destino
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+5491123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato internacional: +[código país][código área][número]
            </p>
          </div>

          {/* Campos adicionales */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del paciente</label>
            <input
              type="text"
              value={nombrePaciente}
              onChange={e => setNombrePaciente(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock previsto</label>
            <input
              type="text"
              value={stockPrevisto}
              onChange={e => setStockPrevisto(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de envío</label>
            <input
              type="text"
              value={fechaEnvio}
              onChange={e => setFechaEnvio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
            <input
              type="text"
              value={producto}
              onChange={e => setProducto(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del operador</label>
            <input
              type="text"
              value={nombreOperador}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Botón de llamada */}
          <button
            onClick={handleTestCall}
            disabled={isLoading || !phoneNumber.trim()}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading || !phoneNumber.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {getStatusIcon()}
            {isLoading ? 'Iniciando llamada...' : 'Iniciar llamada de prueba'}
          </button>

          {/* Estado de la llamada */}
          {callStatus !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg border ${
              callStatus === 'success' ? 'bg-green-50 border-green-200' :
              callStatus === 'error' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className={`font-medium ${
                    callStatus === 'success' ? 'text-green-800' :
                    callStatus === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {getStatusMessage()}
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Detalles de la llamada */}
          {callDetails && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Detalles de la llamada</h3>
                {isPolling && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FaSpinner className="animate-spin text-sm" />
                    <span className="text-sm">Monitoreando...</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Batch Call ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{callDetails.batch_call_id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    callDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
                    callDetails.status === 'failed' ? 'bg-red-100 text-red-800' :
                    callDetails.status === 'cancelled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {callDetails.status || 'Iniciado'}
                  </span>
                </div>
                {callDetails.conversation_id && (
                  <div>
                    <span className="font-medium text-gray-700">Conversation ID:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{callDetails.conversation_id}</span>
                  </div>
                )}
                {callDetails.timestamp && (
                  <div>
                    <span className="font-medium text-gray-700">Iniciada:</span>
                    <span className="ml-2">{new Date(callDetails.timestamp).toLocaleString('es-ES')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            La llamada de prueba se realizará usando el agente configurado y se registrará en el sistema.
          </p>
        </div>
      </div>
    </div>
  );
} 