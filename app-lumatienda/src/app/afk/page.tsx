"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import AdsenseAd from '../../components/AdsenseAd'; // Importar el componente de AdSense

const PAID_CLICK_COOLDOWN_SECONDS = 300; // 5 minutes

export default function AfkPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // State for Paid Click section
  const [isDoingPaidClick, setIsDoingPaidClick] = useState(false);
  const [paidClickCoinsEarned, setPaidClickCoinsEarned] = useState(0);
  const [paidClickMessage, setPaidClickMessage] = useState('');
  const [paidClickCooldown, setPaidClickCooldown] = useState(0); // Cooldown in seconds

  // State for Watch Video section
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);
  const [videoCoinsEarned, setVideoCoinsEarned] = useState(0);
  const [videoAdMessage, setVideoAdMessage] = useState('');

  // State for Passive Timer section
  const [passiveTimer, setPassiveTimer] = useState(630); // 630 seconds = 10 minutes 30 seconds
  const [passiveTimerMessage, setPassiveTimerMessage] = useState('');

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Initial load and cooldown calculation for Paid Click
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        
        // Calculate Paid Click Cooldown
        const lastClickTimestampStr = localStorage.getItem(`lastPaidClick-${parsedUser.email}`);
        if (lastClickTimestampStr) {
          const lastClickTime = parseInt(lastClickTimestampStr, 10);
          const timeElapsed = Math.floor((Date.now() - lastClickTime) / 1000); // in seconds
          const remainingCooldown = PAID_CLICK_COOLDOWN_SECONDS - timeElapsed;

          if (remainingCooldown > 0) {
            setPaidClickCooldown(remainingCooldown);
          } else {
            // Cooldown has expired, remove the timestamp
            localStorage.removeItem(`lastPaidClick-${parsedUser.email}`);
          }
        }
      }
    }
  }, []);

  // Cooldown timer effect for Paid Click
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paidClickCooldown > 0) {
      timer = setInterval(() => {
        setPaidClickCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaidClickMessage(''); // Clear message when cooldown ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paidClickCooldown]);

  // Passive Timer Effect
  useEffect(() => {
    if (!currentUser) {
      setPassiveTimerMessage('Inicia sesión para ganar monedas pasivamente.');
      return;
    }

    setPassiveTimerMessage('Esperando recompensa pasiva...');

    const interval = setInterval(() => {
      setPassiveTimer((prev) => {
        if (prev <= 1) {
          const reward = 1;
          updateUserCoins(currentUser.email, reward);
          setPassiveTimerMessage(`¡Has ganado ${reward} moneda(s) pasivamente! El temporizador se ha reiniciado.`);
          return 630; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentUser?.email]);


  // Helper function to update user coins in localStorage
  const updateUserCoins = (email: string, reward: number) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let updatedUser = null;
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.email === email) {
        updatedUser = { ...u, coins: (u.coins || 0) + reward };
        return updatedUser;
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (updatedUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
  };

  const handlePaidClick = () => {
    if (!currentUser) {
      setPaidClickMessage('Necesitas iniciar sesión para ir a páginas pagadas y ganar monedas.');
      return;
    }
    if (paidClickCooldown > 0) {
      setPaidClickMessage(`Espera ${formatTime(paidClickCooldown)} para volver a hacer clic.`);
      return;
    }

    setPaidClickMessage('Abriendo enlace pagado... Espera 30 segundos en la página externa.');
    setIsDoingPaidClick(true);
    setPaidClickCoinsEarned(0);

    // Open the external link in a new tab
    window.open('https://www.effectivegatecpm.com/m2dkayyb?key=d57336e875017785f25f1ce69e46ddff', '_blank');

    setTimeout(() => {
      const reward = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 coins for paid link click
      setPaidClickCoinsEarned(reward);
      setPaidClickMessage(`¡Has ganado ${reward} moneda(s)!`);
      updateUserCoins(currentUser.email, reward);
      setIsDoingPaidClick(false);
      
      // Set cooldown
      localStorage.setItem(`lastPaidClick-${currentUser.email}`, Date.now().toString());
      setPaidClickCooldown(PAID_CLICK_COOLDOWN_SECONDS);

    }, 30000); // Simulate a 30-second visit
  };

  const handleWatchVideo = () => {
    if (!currentUser) {
      setVideoAdMessage('Necesitas iniciar sesión para ver videos y ganar monedas.');
      return;
    }

    setVideoAdMessage('Cargando video (simulado)...');
    setIsWatchingVideo(true);
    setVideoCoinsEarned(0);

    setTimeout(() => {
      const reward = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 coins for videos
      setVideoCoinsEarned(reward);
      setVideoAdMessage(`¡Has ganado ${reward} moneda(s)!`);
      updateUserCoins(currentUser.email, reward);
      setIsWatchingVideo(false);
    }, 10000); // Simulate a 10-second video
  };


  return (
    <div className="min-h-screen bg-night-DEFAULT text-white p-4 sm:p-8 flex flex-col items-center">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4110493862654992"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-10 text-center">Centro de Actividad AFK</h1>


      {!currentUser ? (
        <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 text-center max-w-md mx-auto">
          <p className="text-xl md:text-2xl font-semibold mb-4">
            Por favor, <Link href="/account" className="text-luma-DEFAULT hover:text-luma-light underline transition-colors duration-200">inicia sesión</Link> para participar y ganar monedas.
          </p>
          <Link 
            href="/account" 
            className="group bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-luma-light/20 mx-auto max-w-xs"
          >
            <span>Iniciar Sesión</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          {/* Left Ad Panel */}
          <div className="bg-[#2a273f]/50 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[150px]">
            <p className="text-lg text-gray-400 mb-2">Anuncio Lateral Izquierdo</p>
            <div className="w-full max-w-[468px] h-auto bg-gray-800/50 flex items-center justify-center text-gray-500 rounded">
              <AdsenseAd
                adClient="ca-pub-4110493862654992"
                adSlot="6637419241" // Specific ad slot for left side
                adFormat="auto"
                fullWidthResponsive={true}
              />
            </div>
          </div>

          {/* Central Content Area */}
          <div className="flex flex-col gap-8">
            {/* Passive Reward Section */}
            <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[180px]">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-3 text-center">Ganancia Pasiva AFK</h2>
              <p className="text-md text-gray-300 mb-4 text-center">
                Ganarás 1 moneda cada {formatTime(630)} simplemente por estar en esta página.
              </p>
              <div className="text-5xl font-extrabold text-green-400 mb-2">
                {formatTime(passiveTimer)}
              </div>
              <p className="text-md text-gray-400 text-center">{passiveTimerMessage}</p>
              <p className="mt-2 text-gray-400">Tus monedas actuales: <span className="font-bold text-luma-light">{currentUser.coins || 0}</span></p>
            </div>

            {/* Paid Click Section */}
            <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[280px]">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-4 text-center">Clic Pagado</h2>
              {isDoingPaidClick ? (
                <>
                  <p className="text-xl mb-4 text-gray-300">{paidClickMessage}</p>
                  <div className="w-full h-32 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
                    <p className="text-xl text-gray-400">Visitando enlace simulado...</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-md md:text-lg mb-4 text-center text-gray-300">{paidClickMessage || `Gana de 1 a 3 monedas por visitar una página durante 30 segundos.`}</p>
                  <button
                    onClick={handlePaidClick}
                    className="group bg-craft-DEFAULT hover:bg-craft-light text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-craft-light/20 flex items-center justify-center space-x-2"
                    disabled={paidClickCooldown > 0 || isDoingPaidClick}
                  >
                    {isDoingPaidClick ? 'Visitando...' : (paidClickCooldown > 0 ? `Disponible en ${formatTime(paidClickCooldown)}` : 'Clic para ganar Monedas')}
                    {!isDoingPaidClick && paidClickCooldown === 0 && <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </button>
                  {paidClickCoinsEarned > 0 && (
                    <p className="mt-4 text-2xl font-bold text-luma-DEFAULT">Moneda(s) ganada(s): {paidClickCoinsEarned}</p>
                  )}
                  <p className="mt-2 text-gray-400">Tus monedas actuales: <span className="font-bold text-luma-light">{currentUser.coins || 0}</span></p>
                </>
              )}
            </div>

            {/* Watch Video Section */}
            <div className="bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[280px]">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-DEFAULT mb-4 text-center">Ver Videos</h2>
              {isWatchingVideo ? (
                <>
                  <p className="text-xl mb-4 text-gray-300">{videoAdMessage}</p>
                  <div className="w-full h-32 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
                    <p className="text-xl text-gray-400">Video de anuncio simulado...</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-md md:text-lg mb-4 text-center text-gray-300">{videoAdMessage || 'Haz clic para ver un video (10 segundos) y ganar 1-3 monedas.'}</p>
                  <button
                    onClick={handleWatchVideo}
                    className="group bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-luma-light/20 flex items-center justify-center space-x-2"
                  >
                    <span>Ver Video y Ganar Monedas</span>
                    <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  {videoCoinsEarned > 0 && (
                    <p className="mt-4 text-2xl font-bold text-luma-DEFAULT">Moneda(s) ganada(s): {videoCoinsEarned}</p>
                  )}
                  <p className="mt-2 text-gray-400">Tus monedas actuales: <span className="font-bold text-luma-light">{currentUser.coins || 0}</span></p>
                </>
              )}
            </div>
          </div>

          {/* Right Ad Panel */}
          <div className="bg-[#2a273f]/50 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[150px]">
            <p className="text-lg text-gray-400 mb-2">Anuncio Lateral Derecho</p>
            <div className="w-full max-w-[468px] h-auto bg-gray-800/50 flex items-center justify-center text-gray-500 rounded">
              <AdsenseAd
                adClient="ca-pub-4110493862654992"
                adSlot="2549822813" // Specific ad slot for right side
                adFormat="autorelaxed"
                fullWidthResponsive={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

