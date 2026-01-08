"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MinecraftSkinViewer from './MinecraftSkinViewer';
import { ArrowRightIcon, CheckBadgeIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FaDiscord } from 'react-icons/fa';
import VerificationModal from './VerificationModal';
import DeleteAccountModal from './DeleteAccountModal'; // Import the new modal
import toast from 'react-hot-toast';

interface User {
  email: string;
  nickname: string;
  discordName: string | null;
  coins: number;
  isEmailVerified?: boolean;
  emailVerificationCode?: string | null;
}

interface ProfileViewProps {
  currentUser: User;
  onLogout: () => void;
}

export default function ProfileView({ currentUser: initialUser, onLogout }: ProfileViewProps) {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  const refreshUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  };

  const handleChangePassword = () => {
    toast.error('Funcionalidad para cambiar contraseña (no implementado)');
  };

  const handleConnectDiscord = () => {
    toast.error('Funcionalidad para conectar Discord (no implementado)');
  };

  const handleVerifyEmail = async () => {
    if (currentUser.isEmailVerified) return;
    setIsLoading(true);
    const toastId = toast.loading('Generando código y enviando correo...');

    try {
      const requestResponse = await fetch('/api/user/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email }),
      });
      const requestData = await requestResponse.json();
      if (!requestResponse.ok) throw new Error(requestData.error || 'No se pudo solicitar el código.');
      
      const verificationCode = requestData.verificationCode;

      const subject = 'Código de Verificación para LumaCraft Network';
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Verificación de Correo Electrónico</h2>
          <p>Tu código de verificación para LumaCraft Network es: <strong>${verificationCode}</strong></p>
        </div>
      `;

      await fetch('/api/send-generic-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: currentUser.email, subject, html: htmlContent }),
      });
      
      toast.success('¡Correo de verificación enviado!', { id: toastId });
      setIsVerificationModalOpen(true);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitVerification = async (userCode: string) => {
    if (!userCode) return;
    setIsLoading(true);
    const toastId = toast.loading('Verificando código...');

    try {
      const response = await fetch('/api/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, code: userCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al verificar.');

      toast.success('¡Correo verificado con éxito!', { id: toastId });
      localStorage.setItem('currentUser', JSON.stringify(data));
      refreshUser();
      setIsVerificationModalOpen(false);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDeleteAccount = async ({ password }: { reason: string; password?: string }) => {
    if (!password) {
      toast.error('La contraseña es obligatoria para eliminar la cuenta.');
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Eliminando cuenta...');
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar la cuenta.');
      
      toast.success("Tu cuenta ha sido eliminada permanentemente.", { id: toastId });
      onLogout();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-night-DEFAULT text-white py-16 px-4">
        {/* UI Content */}
        <section className="relative bg-gradient-to-r from-craft-DEFAULT to-craft-dark p-8 sm:p-10 rounded-xl shadow-2xl mb-12 text-center flex flex-col items-center justify-center">
          <MinecraftSkinViewer initialUsername={currentUser.nickname} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-2" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            ¡Bienvenido, <span className="text-luma-light">{currentUser.nickname}</span>!
          </h1>
        </section>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#2a273f]/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-6 border-b pb-3 border-gray-700">Tu Información</h2>
            <div className="space-y-5 text-lg">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <strong className="text-gray-300">Correo Electrónico:</strong>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-100">{currentUser.email}</span>
                  {currentUser.isEmailVerified ? (
                    <span className="text-xs flex items-center space-x-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-full"><CheckBadgeIcon className="h-4 w-4" /><span>Verificado</span></span>
                  ) : (
                    <span className="text-xs flex items-center space-x-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">No Verificado</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800"><strong className="text-gray-300">Nickname:</strong> <span className="text-luma-light font-semibold">{currentUser.nickname}</span></div>
            </div>
          </section>

          <section className="bg-[#2a273f]/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-6 border-b pb-3 border-gray-700">Acciones de Cuenta</h2>
            <div className="flex flex-col space-y-4 flex-grow">
              <button disabled={isLoading} onClick={handleChangePassword} className="group w-full py-3 px-6 bg-craft-DEFAULT hover:bg-craft-light text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                <span>Cambiar Contraseña</span>
              </button>
              <button disabled={isLoading} onClick={handleConnectDiscord} className="group w-full py-3 px-6 bg-[#7289DA] hover:bg-[#5B6DAB] text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                <FaDiscord className="h-5 w-5" />
                <span>Conectar Discord</span>
              </button>
              
              {!currentUser.isEmailVerified ? (
                 <button disabled={isLoading} onClick={handleVerifyEmail} className="group w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                  <CheckBadgeIcon className="h-5 w-5" />
                  <span>{isLoading ? 'Enviando...' : 'Verificar Correo'}</span>
                </button>
              ) : (
                <button disabled={isLoading} onClick={() => setIsDeleteModalOpen(true)} className="group w-full py-3 px-6 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                  <TrashIcon className="h-5 w-5" />
                  <span>Eliminar Cuenta</span>
                </button>
              )}
            </div>
            <button disabled={isLoading} onClick={onLogout} className="group w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all mt-8 flex items-center justify-center space-x-2 disabled:opacity-50">
              <span>Cerrar Sesión</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </section>
        </div>
      </div>
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => !isLoading && setIsVerificationModalOpen(false)}
        onSubmit={handleSubmitVerification}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isLoading && setIsDeleteModalOpen(false)}
        onSubmit={handleSubmitDeleteAccount}
        isLoading={isLoading}
      />
    </>
  );
}