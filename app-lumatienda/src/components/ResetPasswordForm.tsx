// src/components/ResetPasswordForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    if (tokenFromUrl) setToken(tokenFromUrl);
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Restableciendo contraseña...');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al restablecer la contraseña.');
      }
      
      toast.success(data.message, { id: toastId });
      setIsSuccess(true);

    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-night-DEFAULT text-white">
      <div className="bg-[#2a273f]/70 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT">
          Restablecer Contraseña
        </h1>

        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-400 mb-4">¡Tu contraseña ha sido restablecida con éxito!</p>
            <Link href="/account" className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-craft-DEFAULT hover:bg-craft-light transition-all">
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email-reset" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
              <input type="email" id="email-reset" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-1">Token de Restablecimiento</label>
              <input type="text" id="token" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">Nueva Contraseña</label>
              <input type="password" id="new-password" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
              <input type="password" id="confirm-new-password" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={isLoading} className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-luma-dark hover:bg-luma-dark/80 transition-all mt-6 disabled:bg-gray-600">
              <ArrowPathIcon className="h-6 w-6" />
              <span>{isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
