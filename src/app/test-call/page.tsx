'use client';

import { useState } from 'react';
import { FaUserCircle, FaPhone, FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function TestCall() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'initiating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [stockPrevisto, setStockPrevisto] = useState('');
  const [fechaEnvio, setFechaEnvio] = useState('');
  const [producto, setProducto] = useState('');

  // IDs hardcodeados
  const AGENT_ID = "agent_01jyqdepnrf1x9wfrt9kkyy84t";
  const AGENT_PHONE_NUMBER_ID = "phnum_01jzmyvs1sf49rvgy1vcdrfnd3";
  const AGENT_NAME = "Isabela";
  const AGENT_PHONE = "+54 11 5238 2487";

  const handleTestCall = async () => {
    if (!phoneNumber.trim()) {
      setErrorMessage('Por favor ingresa un número de teléfono');
      return;
    }
    setIsLoading(true);
    setCallStatus('initiating');
    setErrorMessage('');
    try {
      const callResponse = await fetch('/api/test-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (!callResponse.ok) {
        throw new Error('Error al iniciar la llamada');
      }
      const callData = await callResponse.json();
      if (callData.batch_call_id) {
        setCallStatus('success');
      } else {
        throw new Error('No se recibió batch_call_id');
      }
    } catch (error) {
      setCallStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <div className="w-full flex justify-center mb-8 mt-8">
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide text-center w-full" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Llamada Telefónica</h1>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 border border-gray-200">
        {/* Encabezado elegante */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-blue-100 rounded-full p-3">
              <FaUserCircle className="text-blue-600 text-4xl" />
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-900">Agente: {AGENT_NAME}</div>
              <div className="text-sm text-gray-600">Número de teléfono: {AGENT_PHONE}</div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Llamada Telefónica</h1>
          <p className="text-gray-600 text-lg">Completa los datos y presiona “Iniciar llamada”</p>
        </div>

        {/* Mensajes de estado */}
        {callStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded flex items-center gap-3">
            <FaTimesCircle className="text-red-500 text-2xl" />
            <span className="text-red-800 font-medium">{errorMessage}</span>
          </div>
        )}
        {callStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded flex items-center gap-3">
            <FaCheckCircle className="text-green-600 text-2xl" />
            <span className="text-green-900 font-medium">Llamada iniciada exitosamente</span>
          </div>
        )}
        {callStatus === 'initiating' && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
            <span className="text-yellow-900 font-medium">Iniciando llamada...</span>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div>
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
            <div>
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
            <div>
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
            <div className="md:col-span-2">
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
          </div>
          <button
            onClick={handleTestCall}
            disabled={isLoading || !phoneNumber.trim()}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors text-lg shadow-sm
              ${isLoading || !phoneNumber.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {getStatusIcon()}
            {isLoading ? 'Iniciando llamada...' : 'Iniciar llamada'}
          </button>
        </div>
      </div>
    </div>
  );
} 