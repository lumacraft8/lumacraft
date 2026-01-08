// src/components/UserTable.tsx
"use client";

// Define the User type
interface User {
  email: string;
  nickname: string;
  discordName: string | null;
  coins: number;
  isAdmin?: boolean;
  bannedUntil?: number; // Timestamp
}

interface UserTableProps {
  users: User[];
  onDeleteUser: (email: string) => void;
  onTempBanUser: (email: string) => void;
  onToggleAdmin: (email: string) => void;
}

export default function UserTable({ users, onDeleteUser, onTempBanUser, onToggleAdmin }: UserTableProps) {
  return (
    <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 mt-8">
      <h2 className="text-2xl font-bold text-luma-light mb-6">Lista de Usuarios Registrados</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-3">Usuario</th>
              <th className="p-3">Email</th>
              <th className="p-3">Monedas</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isBanned = user.bannedUntil ? user.bannedUntil > Date.now() : false;
              return (
                <tr key={user.email} className={`border-b border-gray-700 ${isBanned ? 'bg-red-900/30' : 'hover:bg-gray-800/50'}`}>
                  <td className="p-3 font-semibold">
                    {user.nickname}
                    {user.isAdmin && <span className="text-xs text-luma-DEFAULT ml-2">(Admin)</span>}
                  </td>
                  <td className="p-3 text-gray-300">{user.email}</td>
                  <td className="p-3 text-luma-DEFAULT font-bold">{user.coins}</td>
                  <td className="p-3">
                    {isBanned ? (
                      <div className="flex flex-col">
                        <span className="px-2 py-1 rounded-full text-xs bg-red-500 text-white">
                          Suspendido
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Hasta: {new Date(user.bannedUntil!).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500 text-white">
                        Activo
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onToggleAdmin(user.email)}
                      className={`font-bold py-1 px-3 rounded text-sm transition-colors ${
                        user.isAdmin 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                    <button 
                      onClick={() => onTempBanUser(user.email)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                      disabled={isBanned}
                    >
                      Suspender
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user.email)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
