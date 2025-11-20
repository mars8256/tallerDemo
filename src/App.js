import React, { useState } from 'react';
import Login from './components/Login';
import DataGrid from './components/DataGrid';
import MachineForm from './components/MachineForm';
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
    // Determinar a dónde regresar según el tipo de usuario
    if (userType === 'admin') {
      setCurrentView('grid'); // Admin regresa al grid
    } else if (userType === 'tecnico') {
      // Técnico puede ir al grid para ver sus registros o mantenerse en form
      setCurrentView('grid'); // Por ahora regresa al grid también
    }
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Si está autenticado, mostrar la vista actual
  return (
    <DataProvider>
      <div className="App">
        {currentView === 'grid' ? (
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
      </div>
    </DataProvider>
  );
}

export default App;
