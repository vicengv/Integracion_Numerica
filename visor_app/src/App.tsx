import './App.css';
import React, { useState } from 'react';

const IntegralOdometro = React.lazy(() => import('./integral_odometro'));

type Page = 'landing' | 'numerica' | 'multidimensional';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [showChangelog, setShowChangelog] = useState(false);

  // Landing page
  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
        {/* Header */}
        <header className="text-center pt-16 pb-8 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-snug">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block leading-[1.2] pb-1">
              Integración Numérica
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-light">Plataforma educativa interactiva</p>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
              🏷️ v1.1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
              📅 Última actualización: 7 abril 2026
            </span>
          </div>
        </header>

        {/* Module Cards */}
        <main className="flex-1 flex flex-col items-center px-4 pb-8 pt-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">

            {/* Card 1: Integración Numérica 1D */}
            <button
              onClick={() => setPage('numerica')}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-left transform hover:scale-[1.02] border border-gray-100 hover:border-blue-200"
            >
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                    🚗
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Integración Numérica</h2>
                    <p className="text-blue-100 text-sm font-medium">en Sistemas Automotrices</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Aprende los fundamentos de la integración numérica aplicada a problemas reales:
                  odómetro, consumo de combustible y rendimiento vehicular.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['🎓 Fundamentos', '📏 Unidades', '📐 Teoría', '🚗 Distancia', '⛽ Combustible', '📊 Rendimiento', '🌍 Escenario Real'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Explorar módulo</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>

            {/* Card 2: Integración Multidimensional */}
            <button
              onClick={() => setPage('multidimensional')}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-left transform hover:scale-[1.02] border border-gray-100 hover:border-purple-200"
            >
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                    🧩
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Integración Multidimensional</h2>
                    <p className="text-purple-100 text-sm font-medium">2D, 3D y Monte Carlo</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Extiende los conceptos a múltiples dimensiones. Simula integrales dobles y triples
                  con métodos de cuadrícula y Monte Carlo sobre distribuciones de calor.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['📐 Fundamentos 2D', '🔧 Métodos 2D', '🎯 Simulación 2D', '🎲 Monte Carlo 2D', '🧊 3D + Monte Carlo', '📊 Comparación'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Explorar módulo</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>

          </div>

          {/* Changelog Section */}
          <div className="max-w-5xl w-full mt-12">
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all px-8 py-5 flex items-center justify-between border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span className="text-lg font-semibold text-gray-800">Historial de Cambios</span>
              </div>
              <span className={`text-gray-400 text-xl transition-transform duration-300 ${showChangelog ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showChangelog && (
              <div className="bg-white rounded-b-2xl shadow-md border border-t-0 border-gray-100 p-8 -mt-1 animate-[fadeIn_0.3s_ease-out]">
                <div className="relative">
                  {/* Línea vertical del timeline */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-gray-300"></div>

                  {/* v1.1 */}
                  <div className="relative pl-16 pb-10">
                    <div className="absolute left-3.5 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">v1.1</span>
                        <span className="text-gray-500 text-sm">7 abril 2026</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Actual</span>
                      </div>
                      <ul className="space-y-1.5 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Página de bienvenida con selección de módulos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Etiqueta de versión y fecha de última actualización</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Historial de cambios en la página principal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Nuevo módulo: Integración Multidimensional (2D/3D + Monte Carlo)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* v1.0.1 */}
                  <div className="relative pl-16 pb-10">
                    <div className="absolute left-3.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">v1.0.1</span>
                        <span className="text-gray-500 text-sm">2 diciembre 2025</span>
                      </div>
                      <ul className="space-y-1.5 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Gráficos responsive al 100% del ancho con ResizeObserver</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Full-bleed en gráficos (sin padding lateral)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Mejoras de UI: tipografía, spacing, wrappers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Extensión del ancho útil de gráficos de velocidad y fuel rate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Actualización de etiqueta Fuel Rate en Escenario Real</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* v1.0 */}
                  <div className="relative pl-16 pb-2">
                    <div className="absolute left-3.5 w-5 h-5 bg-gray-400 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm font-bold">v1.0</span>
                        <span className="text-gray-500 text-sm">1 diciembre 2025</span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Lanzamiento Inicial</span>
                      </div>
                      <ul className="space-y-1.5 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-gray-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Lanzamiento inicial con Vite + React + TypeScript</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-500 mt-0.5">✦</span>
                          <span className="text-gray-700">7 pestañas educativas: Fundamentos, Unidades, Teoría, Distancia, Combustible, Rendimiento, Escenario Real</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Simulaciones interactivas de odómetro y consumo de combustible</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-500 mt-0.5">✦</span>
                          <span className="text-gray-700">Visualizador de datos CSV reales + deploy automático con GitHub Pages</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 px-4 border-t border-gray-200 bg-white/50">
          <p className="text-sm text-gray-400">
            📂 <a href="https://github.com/vicengv/Integracion_Numerica" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">github.com/vicengv/Integracion_Numerica</a>
          </p>
        </footer>
      </div>
    );
  }

  // Integración Numérica (existing app)
  if (page === 'numerica') {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        {/* Back button */}
        <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setPage('landing')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Volver al inicio</span>
          </button>
        </div>
        <div className="p-4">
          <React.Suspense fallback={<div className="text-center py-16 text-gray-500">Cargando...</div>}>
            <IntegralOdometro />
          </React.Suspense>
        </div>
      </div>
    );
  }

  // Integración Multidimensional (full-page iframe)
  if (page === 'multidimensional') {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        {/* Back button */}
        <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => setPage('landing')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Volver al inicio</span>
          </button>
        </div>
        <iframe
          src={`${import.meta.env.BASE_URL}integracion-multidimensional.html`}
          className="flex-1 w-full border-0"
          style={{ minHeight: 'calc(100vh - 48px)' }}
          title="Integración Multidimensional"
        />
      </div>
    );
  }

  return null;
}

export default App
