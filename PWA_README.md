# Taller Demo PWA

## Funcionalidades PWA Implementadas

### ✅ **Manifest Web App**
- Configurado para instalación en dispositivos
- Iconos optimizados para múltiples resoluciones
- Configuración de colores de tema
- `start_url` configurado como "." según solicitud

### ✅ **Service Worker**
- Cacheado inteligente de recursos estáticos
- Estrategia Cache First con Network Fallback
- Funcionamiento offline básico
- Limpieza automática de cachés antiguos

### ✅ **Funcionalidad Offline**
- Detección automática de estado de conexión
- Cola de sincronización para datos pendientes
- Sincronización automática al recuperar conexión
- Almacenamiento local de datos cuando no hay conexión

### ✅ **Componentes PWA**
- Indicador de estado de conexión en tiempo real
- Botón de instalación automático
- Notificaciones de estado PWA
- Interfaz responsive y optimizada

## Funcionalidades de la Aplicación

### **Para Técnicos (tecnico/tecnico):**
- Acceso directo al formulario de registro
- Confirmación después de guardar datos
- Opción de registrar múltiples datos consecutivamente
- Cierre automático si no desea continuar

### **Para Administradores (admin/admin):**
- Acceso completo a pantalla de filtros y consultas
- Gestión de todos los registros
- Funciones de edición y eliminación
- Vista de grid con filtros avanzados

## Instalación PWA

1. **En navegadores Chrome/Edge/Firefox:**
   - Aparecerá automáticamente el botón "📱 Instalar App"
   - Click en el botón para instalar como aplicación nativa

2. **En móviles:**
   - Safari (iOS): "Agregar a pantalla de inicio"
   - Chrome (Android): Aparecerá automáticamente el prompt de instalación

## Características Técnicas

- **Framework:** React 19.2.0
- **Persistencia:** Memoria local + Google Sheets
- **Offline:** Service Worker + IndexedDB simulation
- **Responsive:** CSS Grid + Flexbox
- **Performance:** Optimización para PWA

## Estados de la Aplicación

### **En Línea** 🟢
- Sincronización inmediata con Google Sheets
- Todas las funcionalidades disponibles
- Indicador verde de conexión

### **Sin Conexión** 🔴
- Funcionamiento offline completo
- Datos guardados en cola de sincronización
- Indicador rojo parpadeante
- Sincronización automática al recuperar conexión

## Desarrollo y Producción

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Despliegue en GitHub Pages
npm run deploy
```

La aplicación está completamente configurada como PWA y lista para ser instalada en cualquier dispositivo compatible.