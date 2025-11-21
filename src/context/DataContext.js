import React, { createContext, useContext, useState } from 'react';

// URL del Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsLdtO8wuNd2rcF2s73NLH4nrNKYsyIae7AU80xwseGIA8HJwPFLbC0scdZjSkfZy_ow/exec";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Datos iniciales de ejemplo
  const [data, setData] = useState([
    {
      id: 1,
      maquina: 'CAT-320D',
      operador: 'Juan Pérez',
      horometro: 1250.5,
      finca: 'La Esperanza',
      lote: 'A-15',
      causa: 'mantenimiento',
      horaInicio: '2024-11-20T08:00',
      tiempoEstimado: '4h',
      fechaRegistro: '2024-11-20'
    },
    {
      id: 2,
      maquina: 'JD-8320R',
      operador: 'María García',
      horometro: 890.2,
      finca: 'El Progreso',
      lote: 'B-22',
      causa: 'operacion',
      horaInicio: '2024-11-20T06:30',
      tiempoEstimado: '8h',
      fechaRegistro: '2024-11-20'
    },
    {
      id: 3,
      maquina: 'NH-T8.435',
      operador: 'Carlos Rodríguez',
      horometro: 2150.8,
      finca: 'San José',
      lote: 'C-08',
      causa: 'reparacion',
      horaInicio: '2024-11-19T14:15',
      tiempoEstimado: '2h',
      fechaRegistro: '2024-11-19'
    },
    {
      id: 4,
      maquina: 'CAT-950M',
      operador: 'Ana López',
      horometro: 567.3,
      finca: 'La Esperanza',
      lote: 'A-03',
      causa: 'combustible',
      horaInicio: '2024-11-18T10:45',
      tiempoEstimado: '30min',
      fechaRegistro: '2024-11-18'
    },
    {
      id: 5,
      maquina: 'JD-6120M',
      operador: 'Juan Pérez',
      horometro: 1890.7,
      finca: 'El Progreso',
      lote: 'B-15',
      causa: 'falla',
      horaInicio: '2024-11-17T16:20',
      tiempoEstimado: '1dia',
      fechaRegistro: '2024-11-17'
    }
  ]);

  const [nextId, setNextId] = useState(6);
  
  // Estados para funcionalidad offline
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Manejar cambios en el estado de conexión
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar datos offline cuando se recupera la conexión
  const syncOfflineData = async () => {
    if (offlineQueue.length > 0) {
      console.log('Sincronizando', offlineQueue.length, 'registros pendientes...');
      
      for (const item of offlineQueue) {
        try {
          await sendToGoogleSheet(item.data);
          console.log('Registro sincronizado:', item.id);
        } catch (error) {
          console.error('Error al sincronizar registro:', item.id, error);
        }
      }
      
      setOfflineQueue([]);
      console.log('Sincronización completada');
    }
  };

  // Función para enviar datos a Google Apps Script
  const sendToGoogleSheet = async (data) => {
    // Si está offline, agregar a la cola
    if (!isOnline) {
      const queueItem = {
        id: data.id || Date.now(),
        data,
        timestamp: new Date().toISOString()
      };
      setOfflineQueue(prev => [...prev, queueItem]);
      console.log('Sin conexión: Datos agregados a cola de sincronización');
      return false;
    }

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // necesario por Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log('Datos enviados a Google Sheets exitosamente');
      return true;
    } catch (error) {
      console.error('Error al enviar datos a Google Sheets:', error);
      
      // Agregar a cola offline si falla la conexión
      const queueItem = {
        id: data.id || Date.now(),
        data,
        timestamp: new Date().toISOString(),
        error: error.message
      };
      setOfflineQueue(prev => [...prev, queueItem]);
      console.log('Error de conexión: Datos agregados a cola de sincronización');
      
      return false;
    }
  };

  // Función para agregar un nuevo registro
  const addRecord = async (formData) => {
    // Extraer la fecha del datetime-local para fechaRegistro
    const fechaRegistro = formData.horaInicio ? formData.horaInicio.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const newRecord = {
      id: nextId,
      ...formData,
      horometro: parseFloat(formData.horometro),
      fechaRegistro
    };
    
    // Guardar en memoria local
    setData(prevData => [...prevData, newRecord]);
    setNextId(prevId => prevId + 1);
    
    // Enviar a Google Sheets (sin esperar respuesta para no bloquear la UI)
    sendToGoogleSheet({
      maquina: formData.maquina,
      operador: formData.operador,
      horometro: formData.horometro,
      finca: formData.finca,
      lote: formData.lote,
      causa: formData.causa,
      horaInicio: formData.horaInicio,
      tiempoEstimado: formData.tiempoEstimado,
      fechaRegistro
    });
    
    return newRecord;
  };

  // Función para actualizar un registro existente
  const updateRecord = async (id, formData) => {
    const fechaRegistro = formData.horaInicio ? formData.horaInicio.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const updatedRecord = {
      id,
      ...formData,
      horometro: parseFloat(formData.horometro),
      fechaRegistro
    };
    
    // Actualizar en memoria local
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? updatedRecord : item
      )
    );
    
    // Enviar actualización a Google Sheets (opcional, podrías omitir esto si no quieres actualizaciones en la hoja)
    sendToGoogleSheet({
      ...updatedRecord,
      isUpdate: true, // flag para indicar que es una actualización
      originalId: id
    });
    
    return updatedRecord;
  };

  // Función para eliminar un registro
  const deleteRecord = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  // Función para obtener un registro por ID
  const getRecord = (id) => {
    return data.find(item => item.id === id);
  };

  // Función para filtrar datos
  const filterData = (filters) => {
    let filtered = [...data];

    // Filtrar por operador
    if (filters.operador && filters.operador.trim()) {
      filtered = filtered.filter(item => 
        item.operador.toLowerCase().includes(filters.operador.toLowerCase())
      );
    }

    // Filtrar por causa
    if (filters.causa) {
      filtered = filtered.filter(item => item.causa === filters.causa);
    }

    // Filtrar por fecha inicial
    if (filters.fechaInicial) {
      filtered = filtered.filter(item => item.fechaRegistro >= filters.fechaInicial);
    }

    // Filtrar por fecha final
    if (filters.fechaFinal) {
      filtered = filtered.filter(item => item.fechaRegistro <= filters.fechaFinal);
    }

    return filtered;
  };

  // Función para obtener operadores únicos (para autocompletado)
  const getUniqueOperators = () => {
    return [...new Set(data.map(item => item.operador))].sort();
  };

  // Función para obtener causas únicas
  const getUniqueCausas = () => {
    return [...new Set(data.map(item => item.causa))];
  };

  // Función para obtener información del estado offline
  const getOfflineStatus = () => ({
    isOnline,
    pendingSync: offlineQueue.length,
    queueItems: offlineQueue
  });

  // Función para limpiar cola de sincronización manualmente
  const clearOfflineQueue = () => {
    setOfflineQueue([]);
  };

  const value = {
    data,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecord,
    filterData,
    getUniqueOperators,
    getUniqueCausas,
    getOfflineStatus,
    clearOfflineQueue,
    syncOfflineData,
    totalRecords: data.length
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};