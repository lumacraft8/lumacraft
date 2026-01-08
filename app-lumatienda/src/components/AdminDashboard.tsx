// src/components/AdminDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import UserTable from './UserTable';
import toast from 'react-hot-toast';

// Define the User type
interface User {
  email: string;
  nickname: string;
  discordName: string | null;
  coins: number;
  isAdmin?: boolean;
  bannedUntil?: number; // Timestamp
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all users from the API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users.');
      const data = await response.json();
      setAllUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        if (parsedUser?.isAdmin) {
          fetchUsers();
        }
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const handleDeleteUser = async (email: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${email}? Esta acción no se puede deshacer.`)) {
      const toastId = toast.loading('Eliminando usuario...');
      try {
        const response = await fetch('/api/admin/delete-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete user.');
        toast.success('Usuario eliminado con éxito.', { id: toastId });
        fetchUsers();
      } catch (err: any) {
        toast.error(`Error: ${err.message}`, { id: toastId });
      }
    }
  };

  const handleTempBanUser = async (email: string) => {
    const hours = prompt(`¿Por cuántas horas quieres suspender al usuario ${email}?`, "24");
    if (hours && !isNaN(parseInt(hours))) {
      const toastId = toast.loading('Suspendiendo usuario...');
      try {
        const response = await fetch('/api/admin/ban-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, hours }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to ban user.');
        toast.success('Usuario suspendido con éxito.', { id: toastId });
        fetchUsers();
      } catch (err: any) {
        toast.error(`Error: ${err.message}`, { id: toastId });
      }
    }
  };

  const handleToggleAdmin = async (email: string) => {
    if (window.confirm(`¿Estás seguro de que quieres cambiar el estado de administrador para ${email}?`)) {
      const toastId = toast.loading('Actualizando estado de administrador...');
      try {
        const response = await fetch('/api/admin/toggle-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to toggle admin status.');
        toast.success('Estado de administrador actualizado con éxito.', { id: toastId });
        fetchUsers();
      } catch (err: any) {
        toast.error(`Error: ${err.message}`, { id: toastId });
      }
    }
  };

  if (!isClient || (isClient && !currentUser)) {
    return <div className="min-h-screen bg-night-DEFAULT"></div>;
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-night-DEFAULT text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
        <p className="text-xl text-gray-300">No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-DEFAULT text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-10 text-center">
          Panel de Administración
        </h1>
        
        <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-luma-light mb-4">Bienvenido, {currentUser.nickname}.</h2>
          <p className="text-gray-300">Aquí podrás gestionar usuarios y ver la actividad de la tienda.</p>
        </div>

        {isLoading ? (
          <p className="text-center mt-8">Cargando usuarios...</p>
        ) : error ? (
          <p className="text-center text-red-400 mt-8">{error}</p>
        ) : (
          <UserTable 
            users={allUsers} 
            onDeleteUser={handleDeleteUser} 
            onTempBanUser={handleTempBanUser}
            onToggleAdmin={handleToggleAdmin}
          />
        )}
      </div>
    </div>
  );
}
