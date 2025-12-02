# Integración Numérica - Versión Estática HTML

Esta es una versión simplificada y estática del proyecto de integración numérica en sistemas automotrices, implementada únicamente con HTML, CSS y JavaScript vanilla.

## 🚀 Cómo usar

1. **Abrir el archivo**: Simplemente abre `index.html` en tu navegador web
2. **Navegar**: Usa las pestañas en la parte superior para cambiar entre secciones
3. **Interactuar**: Haz clic en los botones de "Iniciar" para ver las simulaciones en tiempo real

## 📋 Características

### 🧮 Fundamentos
- Explicación simple de derivadas, integrales y sumas de Riemann
- Conceptos matemáticos aplicados a sistemas automotrices

### 🚗 Simulación de Distancia
- **Sensor**: Velocidad en km/h
- **Integración**: `∫ velocidad dt` → distancia recorrida
- **Visualización**: Gráfico SVG con rectángulos de integración numérica
- **Código en vivo**: Muestra el código JavaScript ejecutándose cada 100ms

### ⛽ Simulación de Combustible
- **Sensor**: Fuel Rate en L/h
- **Integración**: `∫ fuel_rate dt` → litros consumidos
- **Conversión**: L/h → L/s para compatibilidad de unidades
- **Visualización**: Gráfico SVG con rectángulos de integración

### 📊 Cálculo de Rendimiento
- **Fórmula**: `Rendimiento = Distancia ÷ Litros`
- **Resultado**: km/L (kilómetros por litro)
- **Cálculo automático**: Se actualiza en tiempo real

## 🔧 Aspectos Técnicos

### Integración Numérica Implementada
```javascript
// Cada 100ms (dt = 0.1s):
const distancia = velocidad_km_s * dt;
odometro += distancia;
```

### Conversión de Unidades
```javascript
// km/h → km/s
velocidad_km_s = velocidad_kmh / 3600;

// L/h → L/s
fuel_rate_Ls = fuel_rate_Lh / 3600;
```

### Funciones Matemáticas
- **Velocidad**: Perfil urbano (30km/h → 50km/h → 25km/h)
- **Fuel Rate**: Consumo variable basado en velocidad
- **Tiempo**: Simulación de 10 segundos a intervalos de 100ms

## 🎨 Diseño

- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Moderno**: Gradientes, sombras y animaciones CSS
- **Accesible**: Navegación clara y feedback visual
- **SVG**: Gráficos vectoriales escalables

## 📁 Estructura de Archivos

```
version_estatica_html/
├── index.html      # Archivo principal HTML
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este archivo
```

## 🌟 Ventajas de la Versión Estática

1. **Sin dependencias**: No requiere Node.js, npm o frameworks
2. **Ligero**: Archivos pequeños y carga rápida
3. **Portátil**: Se puede abrir en cualquier navegador moderno
4. **Educativo**: Código JavaScript visible y fácil de entender
5. **Interactivo**: Simulaciones en tiempo real

## 🎓 Valor Educativo

Esta versión estática mantiene todos los conceptos educativos del proyecto original:

- **Derivadas** → Velocidad como cambio de posición
- **Integrales** → Distancia como acumulación de velocidad
- **Sumas de Riemann** → Método numérico de integración
- **Integración Numérica** → Aplicación práctica en software automotriz

## 🚀 Abrir en Navegador

**Windows**: Doble clic en `index.html`
**Mac/Linux**: Abrir con navegador web desde el explorador de archivos
**Terminal**: `start index.html` (Windows) o `open index.html` (Mac)

¡Disfruta explorando los conceptos de integración numérica aplicados a sistemas automotrices!