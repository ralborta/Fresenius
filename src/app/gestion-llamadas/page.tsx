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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <div className="w-full flex justify-center mb-8 mt-8">
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide text-center w-full" style={{ fontFamily: 'var(--font-geist-sans), Inter, Montserrat, Poppins, Arial, sans-serif' }}>Gestión de Llamadas</h1>
        </div>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
        {/* Placeholder elegante */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-5xl text-blue-300"><svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-12 h-12'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20.5C6.753 20.5 2.5 16.247 2.5 11S6.753 1.5 12 1.5 21.5 5.753 21.5 11 17.247 20.5 12 20.5z' /></svg></span>
          <div className="text-xl text-blue-900 font-semibold">Próximamente</div>
          <div className="text-gray-500 text-center">Esta sección estará disponible en una próxima actualización.</div>
        </div>
      </div>
    </div>
  );
} 