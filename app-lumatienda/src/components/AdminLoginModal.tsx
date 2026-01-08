// src/components/AdminLoginModal.tsx
"use client";

import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email?: string; password?: string; }) => void;
  error: string | null;
}

export default function AdminLoginModal({ isOpen, onClose, onSubmit, error }: AdminLoginModalProps) {
  const [email, setEmail] = useState('mateodomina@gmail.com');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a273f] p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-4">
          Inicio de Sesión de Administrador
        </h2>
        
        {error && (
          <p className="text-center bg-red-500/20 text-red-300 py-2 px-4 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1">Correo de Administrador</label>
              <input type="email" id="admin-email" className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
              <input type="password" id="admin-password" className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-luma-dark hover:bg-luma-dark/80 transition-all duration-300 mt-6">
              <ShieldCheckIcon className="h-6 w-6" />
              <span>Autenticar</span>
            </button>
        </form>
      </div>
    </div>
  );
}
