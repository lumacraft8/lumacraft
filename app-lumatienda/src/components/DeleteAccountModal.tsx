// src/components/DeleteAccountModal.tsx
"use client";

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; password?: string; }) => void;
  isLoading: boolean;
}

export default function DeleteAccountModal({ isOpen, onClose, onSubmit, isLoading }: DeleteAccountModalProps) {
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ reason, password });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a273f] p-8 rounded-xl shadow-xl border border-red-500/50 w-full max-w-md relative">
        <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold disabled:opacity-50">&times;</button>
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">
          Eliminar Cuenta Permanentemente
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Esta acción es irreversible. Para confirmar, por favor dinos el motivo e introduce tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-300 mb-1">Motivo (opcional)</label>
              <textarea 
                id="delete-reason" 
                rows={3}
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-800 text-white" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="delete-password" className="block text-sm font-medium text-gray-300 mb-1">Introduce tu contraseña para confirmar</label>
              <input 
                type="password" 
                id="delete-password" 
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-800 text-white" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" disabled={isLoading} className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-700 hover:bg-red-800 transition-all mt-4 disabled:bg-red-900 disabled:cursor-not-allowed">
              <TrashIcon className="h-6 w-6" />
              <span>{isLoading ? 'Eliminando...' : 'Eliminar mi Cuenta'}</span>
            </button>
        </form>
      </div>
    </div>
  );
}
