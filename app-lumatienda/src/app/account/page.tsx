"use client";

import { useState, useEffect } from 'react';
import AuthView from '../../components/AuthView';
import ProfileView from '../../components/ProfileView';

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    // Optionally redirect or refresh the page to reflect logout state
    window.location.reload(); 
  };

  return (
    <>
      {currentUser ? (
        <ProfileView currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthView onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleRegisterSuccess} />
      )}
    </>
  );
}


