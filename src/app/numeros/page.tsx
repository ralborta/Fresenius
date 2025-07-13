"use client";
import { FaPhoneAlt } from 'react-icons/fa';
export default function NumerosPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <div className="w-full flex justify-center mb-8 mt-8">
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide text-center w-full">Gestión de Números de Teléfono</h1>
        </div>
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] p-8 border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <FaPhoneAlt className="text-5xl text-blue-300" />
          <div className="text-xl text-blue-900 font-semibold">Próximamente</div>
          <div className="text-gray-500 text-center">Esta sección estará disponible en una próxima actualización.</div>
        </div>
      </div>
    </div>
  );
} 