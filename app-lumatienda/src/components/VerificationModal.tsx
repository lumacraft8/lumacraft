// src/components/VerificationModal.tsx
"use client";

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export default function VerificationModal({ isOpen, onClose, onSubmit }: VerificationModalProps) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
    setCode(''); // Reset code input after submission
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a273f] p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-4">
          Verificar Correo Electrónico
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Se ha enviado un código a tu correo. Por favor, introdúcelo a continuación.
          <br/>
          <span className="text-xs text-gray-500">(Para pruebas, revisa la consola del navegador para ver el código)</span>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de 6 dígitos"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl tracking-[.5em] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-craft-DEFAULT bg-gray-800 text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-300 mt-6"
          >
            <CheckIcon className="h-6 w-6" />
            <span>Verificar Código</span>
          </button>
        </form>
      </div>
    </div>
  );
}
