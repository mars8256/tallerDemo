import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import './MachineForm.css';

function MachineForm({ onLogout, onCancel, editData = null, userType }) {
  const { addRecord, updateRecord } = useData();
  const [formData, setFormData] = useState({
    maquina: '',
    operador: '',
    horometro: '',
    finca: '',
    lote: '',
    causa: '',
    horaInicio: '',
    tiempoEstimado: ''
  });

  // Cargar datos de edición si existen
  useEffect(() => {
    if (editData) {
      setFormData({
        maquina: editData.maquina || '',
        operador: editData.operador || '',
        horometro: editData.horometro?.toString() || '',
        finca: editData.finca || '',
        lote: editData.lote || '',
        causa: editData.causa || '',
        horaInicio: editData.horaInicio || '',
        tiempoEstimado: editData.tiempoEstimado || ''
      });
    }
  }, [editData]);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.maquina.trim()) newErrors.maquina = 'La máquina es requerida';
    if (!formData.operador.trim()) newErrors.operador = 'El operador es requerido';
    if (!formData.horometro.trim()) newErrors.horometro = 'El horómetro es requerido';
    if (!formData.finca.trim()) newErrors.finca = 'La finca es requerida';
    if (!formData.lote.trim()) newErrors.lote = 'El lote es requerido';
    if (!formData.causa.trim()) newErrors.causa = 'La causa es requerida';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es requerida';
    if (!formData.tiempoEstimado.trim()) newErrors.tiempoEstimado = 'El tiempo estimado es requerido';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (editData) {
        // Actualizar registro existente
        await updateRecord(editData.id, formData);
        setNotification({ 
          show: true, 
          message: 'Registro actualizado correctamente y enviado a Google Sheets', 
          type: 'success' 
        });
      } else {
        // Crear nuevo registro
        await addRecord(formData);
        setNotification({ 
          show: true, 
          message: 'Nuevo registro creado y enviado a Google Sheets', 
          type: 'success' 
        });
      }
      
      console.log('Datos del formulario:', formData);
      console.log('Modo:', editData ? 'Actualizar' : 'Crear');
      
      // Ocultar notificación después de 2 segundos y regresar
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
        if (onCancel) {
          onCancel();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setNotification({ 
        show: true, 
        message: 'Registro guardado localmente, pero falló el envío a Google Sheets', 
        type: 'warning' 
      });
      
      // Ocultar notificación y regresar después de 3 segundos
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
        if (onCancel) {
          onCancel();
        }
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      maquina: '',
      operador: '',
      horometro: '',
      finca: '',
      lote: '',
      causa: '',
      horaInicio: '',
      tiempoEstimado: ''
    });
    setErrors({});
  };

  return (
    <div className="machine-form-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '⚠️'}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="form-header">
        <div className="header-info">
          <h1 className="form-title">
            {editData ? 'Editar Registro de Máquina' : 'Nuevo Registro de Máquina'}
          </h1>
          <span className={`user-badge user-${userType}`}>
            {userType === 'admin' ? '👑 Administrador' : '🔧 Técnico'}
          </span>
        </div>
        <div className="header-actions">
          {userType === 'admin' && (
            <button onClick={onCancel} className="cancel-btn">
              Volver a Lista
            </button>
          )}
          {userType === 'tecnico' && (
            <button onClick={onCancel} className="cancel-btn">
              Ver Registros
            </button>
          )}
          <button onClick={onLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="form-content">
        <form onSubmit={handleSubmit} className="machine-form">
          <div className="form-group">
            <label htmlFor="maquina">Máquina:</label>
            <input
              type="text"
              id="maquina"
              name="maquina"
              value={formData.maquina}
              onChange={handleChange}
              className={errors.maquina ? 'error' : ''}
              placeholder="Ingrese el nombre/código de la máquina"
            />
            {errors.maquina && <span className="error-message">{errors.maquina}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="operador">Operador:</label>
            <input
              type="text"
              id="operador"
              name="operador"
              value={formData.operador}
              onChange={handleChange}
              className={errors.operador ? 'error' : ''}
              placeholder="Nombre del operador"
            />
            {errors.operador && <span className="error-message">{errors.operador}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="horometro">Horómetro:</label>
            <input
              type="number"
              id="horometro"
              name="horometro"
              value={formData.horometro}
              onChange={handleChange}
              className={errors.horometro ? 'error' : ''}
              placeholder="Horas de funcionamiento"
              min="0"
              step="0.1"
            />
            {errors.horometro && <span className="error-message">{errors.horometro}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="finca">Finca:</label>
              <input
                type="text"
                id="finca"
                name="finca"
                value={formData.finca}
                onChange={handleChange}
                className={errors.finca ? 'error' : ''}
                placeholder="Nombre de la finca"
              />
              {errors.finca && <span className="error-message">{errors.finca}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lote">Lote:</label>
              <input
                type="text"
                id="lote"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                className={errors.lote ? 'error' : ''}
                placeholder="Número/nombre del lote"
              />
              {errors.lote && <span className="error-message">{errors.lote}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="causa">Causa:</label>
            <select
              id="causa"
              name="causa"
              value={formData.causa}
              onChange={handleChange}
              className={errors.causa ? 'error' : ''}
            >
              <option value="">Seleccione una causa</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparacion">Reparación</option>
              <option value="combustible">Combustible</option>
              <option value="operacion">Operación Normal</option>
              <option value="falla">Falla Mecánica</option>
              <option value="clima">Condiciones Climáticas</option>
              <option value="otra">Otra</option>
            </select>
            {errors.causa && <span className="error-message">{errors.causa}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horaInicio">Hora Inicio:</label>
              <input
                type="datetime-local"
                id="horaInicio"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleChange}
                className={errors.horaInicio ? 'error' : ''}
              />
              {errors.horaInicio && <span className="error-message">{errors.horaInicio}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tiempoEstimado">Tiempo Estimado:</label>
              <select
                id="tiempoEstimado"
                name="tiempoEstimado"
                value={formData.tiempoEstimado}
                onChange={handleChange}
                className={errors.tiempoEstimado ? 'error' : ''}
              >
                <option value="">Seleccione tiempo estimado</option>
                <option value="30min">30 minutos</option>
                <option value="1h">1 hora</option>
                <option value="2h">2 horas</option>
                <option value="4h">4 horas</option>
                <option value="8h">8 horas</option>
                <option value="1dia">1 día</option>
                <option value="varios-dias">Varios días</option>
              </select>
              {errors.tiempoEstimado && <span className="error-message">{errors.tiempoEstimado}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="btn btn-secondary" disabled={isSaving}>
              Limpiar
            </button>
            <button type="button" onClick={onCancel} className="btn btn-tertiary" disabled={isSaving}>
              {userType === 'admin' ? 'Cancelar' : 'Ver Lista'}
            </button>
            <button type="submit" className={`btn btn-primary ${isSaving ? 'saving' : ''}`} disabled={isSaving}>
              {isSaving 
                ? (editData ? 'Actualizando...' : 'Guardando...') 
                : (editData ? 'Actualizar Registro' : 'Guardar Registro')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MachineForm;