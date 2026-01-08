// src/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UserCircleIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

// Define a more complete User type
interface User {
  nickname: string;
  email: string;
  isAdmin?: boolean;
}

const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const syncCurrentUser = async () => {
    if (typeof window !== 'undefined') {
      const storedUserJSON = localStorage.getItem('currentUser');
      if (storedUserJSON) {
        const storedUser = JSON.parse(storedUserJSON);
        try {
          // Fetch the latest user data from the server
          const response = await fetch(`/api/auth/me?email=${encodeURIComponent(storedUser.email)}`);
          if (response.ok) {
            const latestUser = await response.json();
            // Only update if there's a meaningful change
            if (JSON.stringify(storedUser) !== JSON.stringify(latestUser)) {
              localStorage.setItem('currentUser', JSON.stringify(latestUser));
              setCurrentUser(latestUser);
            } else {
              setCurrentUser(storedUser);
            }
          } else {
             // If user not found on backend (maybe deleted), log them out
            if(response.status === 404) {
              localStorage.removeItem('currentUser');
              setCurrentUser(null);
            } else {
              setCurrentUser(storedUser); // Fallback to stored user on other API errors
            }
          }
        } catch (error) {
          console.error("Failed to sync user data, using local version.", error);
          setCurrentUser(storedUser); // Fallback to stored user on network error
        }
      } else {
        setCurrentUser(null);
      }
    }
  };


  useEffect(() => {
    syncCurrentUser();

    // Listen for changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser') {
        syncCurrentUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-night-DEFAULT text-white py-4 shadow-xl border-b border-gray-800/60">
      <div className="container mx-auto flex justify-between items-center px-4">
        {currentUser ? (
          <Link href="/account" className="flex items-center space-x-3 group">
            <Image 
              src={`https://minotar.net/avatar/${currentUser.nickname}/40`} 
              alt={`${currentUser.nickname}'s Minecraft Head`} 
              width={40} 
              height={40} 
              className="rounded-full border-2 border-luma-DEFAULT group-hover:scale-110 transition-transform duration-200"
              unoptimized
              onError={(e) => {
                e.currentTarget.src = "/images/steve_face.svg";
              }}
            />
            <span className="text-2xl font-bold text-luma-light group-hover:text-luma-DEFAULT transition-colors duration-200">{currentUser.nickname}</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center space-x-2 group">
            <Image src="/logo.png" alt="LumaCraft Network Logo" width={40} height={40} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-2xl font-bold text-luma-DEFAULT group-hover:text-luma-light transition-colors duration-200">LumaCraft Network</span>
          </Link>
        )}
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className="group relative text-lg hover:text-luma-light transition-colors duration-200 px-3 py-2">
                Inicio
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/afk" className="group relative text-lg hover:text-luma-light transition-colors duration-200 px-3 py-2">
                AFK
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/shop" className="group relative text-lg hover:text-luma-light transition-colors duration-200 px-3 py-2">
                Tienda
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/cart" className="group relative text-lg hover:text-luma-light transition-colors duration-200 px-3 py-2 flex items-center space-x-1">
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Carrito</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/account" className="group relative text-lg hover:text-luma-light transition-colors duration-200 px-3 py-2 flex items-center space-x-1">
                <UserCircleIcon className="h-5 w-5" />
                <span>Cuenta</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
            {/* Conditional Admin Link */}
            {currentUser?.isAdmin && (
              <li>
                <Link href="/admin" className="group relative text-lg text-luma-DEFAULT hover:text-luma-light transition-colors duration-200 px-3 py-2 flex items-center space-x-1">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Admin</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-luma-DEFAULT scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;