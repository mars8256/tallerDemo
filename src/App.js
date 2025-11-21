import React, { useState } from 'react';
import Login from './components/Login';
import DataGrid from './components/DataGrid';
import MachineForm from './components/MachineForm';
import PWAStatus from './components/PWAStatus';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin' | 'tecnico'
  const [currentView, setCurrentView] = useState('grid'); // 'grid' | 'form'
  const [editingData, setEditingData] = useState(null);

  const handleLogin = (success, username) => {
    if (success) {
      setIsAuthenticated(true);
      setUserType(username);
      
      // Determinar vista inicial según tipo de usuario
      if (username === 'admin') {
        setCurrentView('grid'); // Admin va al grid/filtros
      } else if (username === 'tecnico') {
        setCurrentView('form'); // Técnico va directo al formulario
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentView('grid');
    setEditingData(null);
  };

  const handleAddNew = () => {
    setEditingData(null);
    setCurrentView('form');
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setCurrentView('form');
  };

  const handleCancel = () => {
    setEditingData(null);
    // Solo admin puede regresar al grid
    if (userType === 'admin') {
      setCurrentView('grid'); // Admin regresa al grid
    }
    // Técnico no tiene acceso al grid, por lo que permanece en form o se desconecta
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
        <PWAStatus />
      </div>
    );
  }

  // Si está autenticado, mostrar la vista actual
  return (
    <DataProvider>
      <div className="App">
        {currentView === 'grid' && userType === 'admin' ? (
          <DataGrid 
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onLogout={handleLogout}
            userType={userType}
          />
        ) : (
          <MachineForm 
            onLogout={handleLogout}
            onCancel={handleCancel}
            editData={editingData}
            userType={userType}
          />
        )}
        <PWAStatus />
      </div>
    </DataProvider>
  );
}

export default App;
