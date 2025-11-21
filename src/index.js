import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado exitosamente:', registration.scope);
        
        // Verificar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                console.log('Nueva versión disponible. Recarga la página para actualizar.');
                
                // Opcional: Mostrar notificación al usuario
                if (window.confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('Error al registrar Service Worker:', error);
      });
  });

  // Manejar actualizaciones del Service Worker
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// Event listener para el evento beforeinstallprompt (PWA install prompt)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: Prompt de instalación disponible');
  e.preventDefault();
  deferredPrompt = e;
  
  // Opcional: Mostrar botón de instalación personalizado
  showInstallButton();
});

// Función para mostrar el prompt de instalación
function showInstallButton() {
  // Crear botón de instalación si no existe
  if (!document.getElementById('pwa-install-button')) {
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.textContent = 'Instalar App';
    installButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2196f3;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    installButton.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Usuario aceptó instalar la PWA');
          } else {
            console.log('Usuario rechazó instalar la PWA');
          }
          deferredPrompt = null;
          installButton.remove();
        });
      }
    });
    
    document.body.appendChild(installButton);
  }
}

// Detectar cuando la app se instala
window.addEventListener('appinstalled', () => {
  console.log('PWA instalada exitosamente');
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.remove();
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
