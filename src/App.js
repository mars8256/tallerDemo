import React, { useState } from 'react';
import Login from './components/Login';
import DataGrid from './components/DataGrid';
import MachineForm from './components/MachineForm';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('grid'); // 'grid' | 'form'
  const [editingData, setEditingData] = useState(null);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      setCurrentView('grid'); // Ir al grid después del login
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
    setCurrentView('grid');
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
          />
        ) : (
          <MachineForm 
            onLogout={handleLogout}
            onCancel={handleCancel}
            editData={editingData}
          />
        )}
      </div>
    </DataProvider>
  );
}

export default App;
