// src/components/ForgotPasswordModal.tsx
"use client";

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, onSubmit }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a273f] p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-4">
          Restablecer Contraseña
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Introduce tu correo electrónico y te enviaremos (simularemos) un enlace para restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                id="reset-email" 
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-craft-DEFAULT hover:bg-craft-light transition-all duration-300 mt-4">
              <PaperAirplaneIcon className="h-6 w-6" />
              <span>Enviar Enlace</span>
            </button>
        </form>
      </div>
    </div>
  );
}
