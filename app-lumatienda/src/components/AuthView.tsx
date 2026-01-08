"use client";

import { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import ForgotPasswordModal from './ForgotPasswordModal';
import toast from 'react-hot-toast';

interface AuthViewProps {
  onLoginSuccess: (user: any) => void;
  onRegisterSuccess: (user: any) => void;
}

export default function AuthView({ onLoginSuccess, onRegisterSuccess }: AuthViewProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
    setMessage('');
  }, [isLoginView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error.');
      }

      localStorage.setItem('currentUser', JSON.stringify(data));
      onLoginSuccess(data);

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (emailToReset: string) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Step 1: Request a password reset link from the backend
      const requestResponse = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToReset }),
      });

      const requestData = await requestResponse.json();

      if (!requestResponse.ok) {
        throw new Error(requestData.error || 'No se pudo procesar la solicitud.');
      }

      // If a reset link is generated, send the email
      if (requestData.resetLink) {
        const sendEmailResponse = await fetch('/api/send-reset-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToReset, resetLink: requestData.resetLink }),
        });

        if (!sendEmailResponse.ok) {
          throw new Error('No se pudo enviar el correo de restablecimiento.');
        }
      }

      toast.success('Si existe una cuenta con ese correo, se ha enviado un enlace de restablecimiento.');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsForgotPasswordModalOpen(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error durante el registro.');
      }

      localStorage.setItem('currentUser', JSON.stringify(data));
      onRegisterSuccess(data);

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-night-DEFAULT text-white">
        <div className="bg-[#2a273f]/70 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT">
            {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>

          {message && (
            <p className="text-center mb-4 text-red-400 font-medium">{message}</p>
          )}

          {isLoginView ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Login Form */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                <input type="email" id="email" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-craft-DEFAULT bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input type="password" id="password" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-craft-DEFAULT bg-gray-800 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="text-right">
                <button type="button" onClick={() => !isLoading && setIsForgotPasswordModalOpen(true)} className="text-sm text-luma-light hover:underline disabled:opacity-50" disabled={isLoading}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <button type="submit" disabled={isLoading} className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-craft-DEFAULT hover:bg-craft-light transition-all disabled:bg-craft-dark disabled:cursor-not-allowed">
                <span>{isLoading ? 'Cargando...' : 'Iniciar Sesión'}</span>
                {!isLoading && <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Register Form */}
              <div>
                <label htmlFor="email-reg" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                <input type="email" id="email-reg" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
               <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">Minecraft Username</label>
                <input type="text" id="nickname" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="password-reg" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input type="password" id="password-reg" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" disabled={isLoading} className="disabled:opacity-50 mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luma-DEFAULT bg-gray-800 text-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={isLoading} className="group w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-night-DEFAULT bg-luma-DEFAULT hover:bg-luma-light transition-all disabled:bg-luma-dark disabled:cursor-not-allowed mt-4">
                <span>{isLoading ? 'Registrando...' : 'Registrarse'}</span>
                 {!isLoading && <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button onClick={() => !isLoading && setIsLoginView(!isLoginView)} className="text-luma-DEFAULT hover:text-luma-light font-medium transition-colors duration-200 relative group text-lg disabled:opacity-50" disabled={isLoading}>
              {isLoginView ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia Sesión'}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </div>
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen}
        onClose={() => !isLoading && setIsForgotPasswordModalOpen(false)}
        onSubmit={handleForgotPasswordSubmit}
      />
    </>
  );
}