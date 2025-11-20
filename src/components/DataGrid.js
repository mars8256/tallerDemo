import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import './DataGrid.css';

function DataGrid({ onAddNew, onLogout, onEdit, userType }) {
  const { data, filterData, getUniqueOperators, totalRecords, deleteRecord } = useData();
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    operador: '',
    causa: '',
    fechaInicial: '',
    fechaFinal: ''
  });

  // Actualizar datos filtrados cuando cambien los datos principales o filtros
  useEffect(() => {
    setFilteredData(filterData(filters));
  }, [data, filters, filterData]);

  const causaLabels = {
    mantenimiento: 'Mantenimiento',
    reparacion: 'Reparación',
    combustible: 'Combustible',
    operacion: 'Operación Normal',
    falla: 'Falla Mecánica',
    clima: 'Condiciones Climáticas',
    otra: 'Otra'
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    const filtered = filterData(filters);
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      operador: '',
      causa: '',
      fechaInicial: '',
      fechaFinal: ''
    };
    setFilters(clearedFilters);
    setFilteredData(filterData(clearedFilters));
  };

  const handleDelete = (id, maquina) => {
    if (window.confirm(`¿Está seguro que desea eliminar el registro de la máquina "${maquina}"?`)) {
      deleteRecord(id);
      alert('Registro eliminado correctamente!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="datagrid-container">
      {/* Header */}
      <div className="datagrid-header">
        <div className="header-info">
          <h1 className="datagrid-title">
            Gestión de Máquinas 
            <span className={`user-badge user-${userType}`}>
              {userType === 'admin' ? '👑 Administrador' : '🔧 Técnico'}
            </span>
          </h1>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h2 className="filters-title">
          {userType === 'admin' ? 'Filtros de Búsqueda - Vista Administrativa' : 'Consulta de Registros'}
        </h2>
        <div className="filters-form">
          <div className="filter-group">
            <label htmlFor="operador">Operador:</label>
            <input
              type="text"
              id="operador"
              name="operador"
              value={filters.operador}
              onChange={handleFilterChange}
              placeholder="Buscar por operador"
              list="operadores"
            />
            <datalist id="operadores">
              {getUniqueOperators().map(operador => (
                <option key={operador} value={operador} />
              ))}
            </datalist>
          </div>

          <div className="filter-group">
            <label htmlFor="causa">Causa:</label>
            <select
              id="causa"
              name="causa"
              value={filters.causa}
              onChange={handleFilterChange}
            >
              <option value="">Todas las causas</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparacion">Reparación</option>
              <option value="combustible">Combustible</option>
              <option value="operacion">Operación Normal</option>
              <option value="falla">Falla Mecánica</option>
              <option value="clima">Condiciones Climáticas</option>
              <option value="otra">Otra</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="fechaInicial">Fecha Inicial:</label>
            <input
              type="date"
              id="fechaInicial"
              name="fechaInicial"
              value={filters.fechaInicial}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="fechaFinal">Fecha Final:</label>
            <input
              type="date"
              id="fechaFinal"
              name="fechaFinal"
              value={filters.fechaFinal}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <button onClick={handleSearch} className="btn btn-primary">
              Buscar
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Limpiar
            </button>
            <button onClick={onAddNew} className="btn btn-success">
              Agregar Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Grid de datos */}
      <div className="data-section">
        <div className="data-header">
          <h3>Total de Registros: {totalRecords} | Filtrados: {filteredData.length}</h3>
          <div className="data-stats">
            <span>Operadores únicos: {getUniqueOperators().length}</span>
          </div>
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Máquina</th>
                <th>Operador</th>
                <th>Horómetro</th>
                <th>Finca</th>
                <th>Lote</th>
                <th>Causa</th>
                <th>Hora Inicio</th>
                <th>Tiempo Est.</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="machine-name">{item.maquina}</td>
                    <td>{item.operador}</td>
                    <td>{item.horometro.toFixed(1)}</td>
                    <td>{item.finca}</td>
                    <td>{item.lote}</td>
                    <td>
                      <span className={`causa-badge causa-${item.causa}`}>
                        {causaLabels[item.causa]}
                      </span>
                    </td>
                    <td>{formatTime(item.horaInicio)}</td>
                    <td>{item.tiempoEstimado}</td>
                    <td>{formatDate(item.fechaRegistro)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => onEdit(item)} 
                          className="btn-action btn-edit"
                          title="Editar registro"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.maquina)} 
                          className="btn-action btn-delete"
                          title="Eliminar registro"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-data">
                    No se encontraron registros con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataGrid;