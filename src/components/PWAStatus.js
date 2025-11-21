import React, { useState, useEffect } from 'react';
import './PWAStatus.css';

function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Manejar estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Manejar prompt de instalación PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
      
      setInstallPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <>
      {/* Estado de conexión */}
      <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
        <span className="status-indicator">
          {isOnline ? '🟢' : '🔴'}
        </span>
        <span className="status-text">
          {isOnline ? 'En línea' : 'Sin conexión'}
        </span>
      </div>

      {/* Botón de instalación PWA */}
      {showInstallButton && (
        <button 
          className="pwa-install-button"
          onClick={handleInstallClick}
          title="Instalar aplicación"
        >
          📱 Instalar App
        </button>
      )}
    </>
  );
}

export default PWAStatus;