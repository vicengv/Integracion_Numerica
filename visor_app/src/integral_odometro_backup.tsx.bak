import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { visualizadorHtml } from './visualizador_data';

const IntegralOdometro = () => {
  const [tab, setTab] = useState('fundamentos');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [odometro, setOdometro] = useState(0);
  const [rectangulos, setRectangulos] = useState([]);
  const [litrosConsumidos, setLitrosConsumidos] = useState(0);
  const [rectangulosCombustible, setRectangulosCombustible] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');

  const dt = 0.1; // 100 milisegundos = 0.1 segundos
  const maxTime = 10; // 10 segundos de simulación

  // Función de velocidad en km/h (ejemplo: conducción urbana)
  const velocidadKmH = (t) => {
    if (t < 3) return 30; // 30 km/h constante
    if (t < 6) return 30 + 20 * ((t - 3) / 3); // aceleración hasta 50 km/h
    if (t < 8) return 50; // 50 km/h constante
    return 50 - 25 * ((t - 8) / 2); // desaceleración hasta 25 km/h
  };

  // Función de fuel rate en litros/hora (basada en un perfil típico de autobús)
  const fuelRateLPorH = (t) => {
    if (t < 3) return 10; // 10 L/h constante
    if (t < 6) return 10 + 6.67 * ((t - 3) / 3); // aumento hasta 16.67 L/h
    if (t < 8) return 16.67; // 16.67 L/h constante
    return 16.67 - 8.34 * ((t - 8) / 2); // disminución hasta 8.33 L/h
  };

  useEffect(() => {
    let interval;
    if (isPlaying && time < maxTime) {
      interval = setInterval(() => {
        setTime(t => {
          const newTime = t + dt;
          if (newTime > maxTime) {
            setIsPlaying(false);
            return maxTime;
          }

          // Cálculo del odómetro (integración numérica)
          const vKmH = velocidadKmH(t);
          const vKmS = vKmH / 3600; // convertir km/h a km/s
          const distanciaEnEsteIntervalo = vKmS * dt; // km recorridos en este dt
          setOdometro(odo => odo + distanciaEnEsteIntervalo);

          // Cálculo de combustible consumido (integración numérica)
          const fuelRate = fuelRateLPorH(t); // litros/hora
          const fuelRateLPorS = fuelRate / 3600; // convertir L/h a L/s
          const litrosEnEsteIntervalo = fuelRateLPorS * dt; // litros consumidos en este dt
          setLitrosConsumidos(litros => litros + litrosEnEsteIntervalo);

          // Guardar rectángulos para visualización
          setRectangulos(rects => [...rects, { t, v: vKmH, dt }]);
          setRectangulosCombustible(rects => [...rects, { t, v: fuelRate, dt }]);

          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time]);

  useEffect(() => {
    const blob = new Blob([visualizadorHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);

    return () => URL.revokeObjectURL(url);
  }, []);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setOdometro(0);
    setLitrosConsumidos(0);
    setRectangulos([]);
    setRectangulosCombustible([]);
  };

  // Calcular escala para el gráfico
  const scaleX = 48; // píxeles por segundo
  const scaleY = 4; // píxeles por km/h
  const graphHeight = 300;
  const graphWidth = 520;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Integración Numérica
          </h1>
          <p className="text-xl text-gray-600 font-light">en Sistemas Automotrices</p>
        </header>

        {/* Modern Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8 flex flex-wrap gap-2 justify-center sticky top-4 z-10 backdrop-blur-md bg-opacity-90 border border-gray-100">
          {[
            { id: 'fundamentos', label: 'Fundamentos', icon: '🎓' },
            { id: 'unidades', label: 'Unidades', icon: '📏' },
            { id: 'teoria', label: 'Teoría', icon: '📐' },
            { id: 'simulacion', label: 'Ejemplo: Distancia', icon: '🚗' },
            { id: 'combustible', label: 'Ejemplo: Combustible', icon: '⛽' },
            { id: 'rendimiento', label: 'Ejemplo: Rendimiento', icon: '📊' },
            { id: 'aplicacion', label: 'Escenario Real', icon: '🌍' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === item.id
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de Fundamentos */}
        {tab === 'fundamentos' && (
          <div className="space-y-8 animate-fade-in">
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-8">
                <h2 className="text-3xl font-bold text-orange-900 flex items-center gap-3">
                  🎓 Fundamentos: Explicado de Forma Simple
                </h2>
              </div>
              <div className="p-8 space-y-8">

                <div className="space-y-8">

                  {/* ¿Qué es una Derivada? */}
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                      <span>📈</span> ¿Qué es una Derivada?
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-lg font-semibold mb-2">Imagina que estás viendo crecer una planta:</p>
                        <ul className="space-y-2 ml-4">
                          <li>🌱 El lunes mide 10 cm</li>
                          <li>🌿 El martes mide 12 cm</li>
                          <li>🌳 Creció 2 cm en 1 día</li>
                        </ul>
                        <p className="mt-3 text-blue-800 font-semibold">
                          La derivada te dice: <strong>"¿Qué tan rápido está cambiando algo?"</strong>
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded">
                          <p className="font-semibold text-green-800 mb-2">Ejemplo 1: El Auto</p>
                          <p className="text-sm">Si sabes <strong>dónde está el auto</strong> en cada momento...</p>
                          <p className="text-lg mt-2">📍 Posición → 🔄 Derivada → 🚗 Velocidad</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded">
                          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-3">
                              <span className="bg-blue-100 p-2 rounded-lg">📈</span> ¿Qué es una Derivada?
                            </h3>

                            <div className="space-y-6">
                              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
                                <p className="text-lg font-semibold mb-4 text-blue-900">Imagina que estás viendo crecer una planta:</p>
                                <ul className="space-y-3 ml-4">
                                  <li className="flex items-center gap-2"><span className="text-xl">🌱</span> El lunes mide 10 cm</li>
                                  <li className="flex items-center gap-2"><span className="text-xl">🌿</span> El martes mide 12 cm</li>
                                  <li className="flex items-center gap-2"><span className="text-xl">🌳</span> Creció 2 cm en 1 día</li>
                                </ul>
                                <p className="mt-4 text-blue-800 font-bold text-lg bg-white/50 p-3 rounded-lg inline-block">
                                  La derivada te dice: "¿Qué tan rápido está cambiando algo?"
                                </p>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50 p-6 rounded-xl shadow-sm transform transition-transform hover:scale-105 duration-300">
                                  <p className="font-semibold text-green-800 mb-3 text-lg">Ejemplo 1: El Auto</p>
                                  <p className="text-base text-gray-700">Si sabes <strong>dónde está el auto</strong> en cada momento...</p>
                                  <p className="text-xl mt-3 font-bold text-green-600">📍 Posición → 🔄 Derivada → 🚗 Velocidad</p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-xl shadow-sm transform transition-transform hover:scale-105 duration-300">
                                  <p className="font-semibold text-yellow-800 mb-3 text-lg">Ejemplo 2: La Temperatura</p>
                                  <p className="text-base text-gray-700">Si sabes <strong>la temperatura</strong> cada hora...</p>
                                  <p className="text-xl mt-3 font-bold text-yellow-600">🌡️ Temperatura → 🔄 Derivada → 📊 Cambio por hora</p>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center border border-gray-200 shadow-inner">
                                <p className="text-2xl font-bold text-gray-700 mb-2">
                                  Derivada = "¿Qué tan rápido cambia?"
                                </p>
                                <p className="text-gray-500 text-lg">Es la pendiente de la curva en un punto</p>
                              </div>
                            </div>
                          </div>

                          {/* ¿Qué es una Integral? */}
                          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-3">
                              <span className="bg-purple-100 p-2 rounded-lg">📊</span> ¿Qué es una Integral?
                            </h3>

                            <div className="space-y-6">
                              <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
                                <p className="text-lg font-semibold mb-4 text-purple-900">Imagina que caminas y alguien mide tu velocidad:</p>
                                <ul className="space-y-3 ml-4">
                                  <li className="flex items-center gap-2"><span className="text-xl">⏱️</span> Primer minuto: vas a 5 km/h</li>
                                  <li className="flex items-center gap-2"><span className="text-xl">⏱️</span> Segundo minuto: vas a 6 km/h</li>
                                  <li className="flex items-center gap-2"><span className="text-xl">⏱️</span> Tercer minuto: vas a 4 km/h</li>
                                  <li className="flex items-center gap-2 font-bold text-purple-700"><span className="text-xl">❓</span> ¿Cuánto caminaste en total?</li>
                                </ul>
                                <p className="mt-4 text-purple-800 font-bold text-lg bg-white/50 p-3 rounded-lg inline-block">
                                  La integral te dice: "¿Cuánto se acumuló en total?"
                                </p>
                              </div>

                              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <p className="font-bold text-purple-900 mb-4 text-center text-lg">La integral es lo OPUESTO a la derivada:</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Si tienes...</p>
                                    <p className="text-xl font-extrabold text-blue-600 mb-2">Posición</p>
                                    <div className="text-gray-400 my-1">↓ derivada</div>
                                    <p className="text-xl font-extrabold text-green-600">Velocidad</p>
                                  </div>
                                  <div className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Puedes recuperar...</p>
                                    <p className="text-xl font-extrabold text-blue-600 mb-2">Posición</p>
                                    <div className="text-gray-400 my-1">↑ integral</div>
                                    <p className="text-xl font-extrabold text-green-600">Velocidad</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl text-center shadow-lg transform transition-all hover:shadow-xl">
                                <p className="text-2xl font-bold mb-2">
                                  Integral = "Sumar todo lo que pasó"
                                </p>
                                <p className="text-purple-100 text-lg">Es como juntar todas las pequeñas partes para saber el total</p>
                              </div>
                            </div>
                          </div>

                          {/* ¿Qué son las Sumas de Riemann? */}
                          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-3">
                              <span className="bg-green-100 p-2 rounded-lg">🧮</span> ¿Qué son las Sumas de Riemann?
                            </h3>

                            <div className="space-y-6">
                              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
                                <p className="text-lg font-semibold mb-4 text-green-900">Imagina que quieres saber cuánta agua cabe bajo un tobogán curvo:</p>

                                <div className="bg-white/80 p-4 rounded-lg mb-4 shadow-sm">
                                  <p className="mb-2 flex items-center gap-2"><span className="text-xl">🤔</span> <strong>Problema:</strong> El tobogán tiene una forma rara, no es un rectángulo simple</p>
                                  <p className="flex items-center gap-2"><span className="text-xl">💡</span> <strong>Solución de Riemann:</strong> ¡Usa bloques rectangulares!</p>
                                </div>

                                <div className="space-y-3 ml-4 text-gray-700">
                                  <p className="flex items-center gap-2"><span className="text-xl">📦</span> Pones un bloque rectangular aquí</p>
                                  <p className="flex items-center gap-2"><span className="text-xl">📦</span> Otro bloque rectangular allá</p>
                                  <p className="flex items-center gap-2"><span className="text-xl">📦</span> Muchos bloques pequeños siguiendo la curva</p>
                                  <p className="flex items-center gap-2 font-bold text-green-700"><span className="text-xl">➕</span> Sumas el área de TODOS los bloques</p>
                                </div>

                                <div className="bg-yellow-100 p-4 rounded-lg mt-4 border border-yellow-200 shadow-sm">
                                  <p className="font-semibold text-yellow-900 text-lg">✨ Mientras más bloques uses (más pequeños), ¡más exacto es el resultado!</p>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-red-50 p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
                                  <p className="text-4xl mb-3">📦📦</p>
                                  <p className="font-bold text-red-800 text-lg">Pocos bloques</p>
                                  <p className="text-sm text-gray-600">Menos exacto</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
                                  <p className="text-4xl mb-3">📦📦📦📦</p>
                                  <p className="font-bold text-orange-800 text-lg">Más bloques</p>
                                  <p className="text-sm text-gray-600">Más exacto</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
                                  <p className="text-4xl mb-3">📦📦📦📦📦📦</p>
                                  <p className="font-bold text-green-800 text-lg">Muchos bloques</p>
                                  <p className="text-sm text-gray-600">¡Muy exacto!</p>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center border border-gray-200 shadow-inner">
                                <p className="text-2xl font-bold text-gray-700 mb-2">
                                  Sumas de Riemann = "Aproximar con rectángulos"
                                </p>
                                <p className="text-gray-500 text-lg">Es la base de cómo las computadoras "integran"</p>
                              </div>
                            </div>
                          </div>

                          {/* ¿Qué es Integración Numérica? */}
                          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-red-700 flex items-center gap-3">
                              <span className="bg-red-100 p-2 rounded-lg">💻</span> ¿Qué es Integración Numérica?
                            </h3>

                            <div className="space-y-6">
                              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                                <p className="text-lg font-semibold mb-4 text-red-900">Es cuando una computadora hace las sumas de Riemann por ti:</p>

                                <div className="space-y-4">
                                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                    <p className="font-bold text-red-800 mb-2 text-lg">🎓 En matemáticas puras:</p>
                                    <p className="text-base ml-4 text-gray-700">Usas fórmulas perfectas con símbolos ∫ y resuelves en papel</p>
                                  </div>

                                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                    <p className="font-bold text-blue-800 mb-2 text-lg">💻 En computadoras:</p>
                                    <p className="text-base ml-4 text-gray-700">La computadora NO tiene fórmulas perfectas</p>
                                    <p className="text-base ml-4 text-gray-700">Solo tiene números: velocidad cada 100 ms</p>
                                    <p className="text-base ml-4 text-gray-700">Entonces usa bloques (sumas de Riemann) para calcular</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
                                <p className="text-2xl font-bold mb-4">🎯 Ejemplo del Auto (tu código):</p>
                                <div className="bg-white/20 p-5 rounded-lg space-y-3 text-lg">
                                  <p className="flex items-center gap-2"><span className="text-xl">1️⃣</span> Lees velocidad cada 100 ms → <strong>50 km/h</strong></p>
                                  <p className="flex items-center gap-2"><span className="text-xl">2️⃣</span> Calculas cuánto avanzó en esos 100 ms → <strong>un poquito</strong></p>
                                  <p className="flex items-center gap-2"><span className="text-xl">3️⃣</span> Lo sumas al odómetro → <strong>acumulas</strong></p>
                                  <p className="flex items-center gap-2"><span className="text-xl">4️⃣</span> Repites miles de veces → <strong>¡Integración numérica!</strong></p>
                                </div>
                              </div>

                              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400 shadow-sm">
                                <p className="font-bold text-xl text-yellow-900 mb-3">🌟 La Magia:</p>
                                <p className="text-gray-800 text-lg leading-relaxed">
                                  Tu código hace EXACTAMENTE lo que un matemático hace con una integral,
                                  pero usando números reales en lugar de fórmulas abstractas.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Conectándolo Todo */}
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                              <span className="text-4xl">🔗</span> Conectando Todo
                            </h3>

                            <div className="space-y-4 bg-white/10 p-6 rounded-lg">
                              <div className="flex items-center gap-4 text-lg">
                                <span className="text-3xl font-bold text-indigo-200">1️⃣</span>
                                <p><strong>Derivada:</strong> De posición sacas velocidad (¿qué tan rápido cambia?)</p>
                              </div>
                              <div className="flex items-center gap-4 text-lg">
                                <span className="text-3xl font-bold text-indigo-200">2️⃣</span>
                                <p><strong>Integral:</strong> De velocidad recuperas distancia (sumar todo)</p>
                              </div>
                              <div className="flex items-center gap-4 text-lg">
                                <span className="text-3xl font-bold text-indigo-200">3️⃣</span>
                                <p><strong>Sumas de Riemann:</strong> Método de usar rectángulos para aproximar</p>
                              </div>
                              <div className="flex items-center gap-4 text-lg">
                                <span className="text-3xl font-bold text-indigo-200">4️⃣</span>
                                <p><strong>Integración Numérica:</strong> Tu código hace las sumas de Riemann automáticamente</p>
                              </div>
                            </div>

                            <div className="mt-6 bg-white text-indigo-900 p-6 rounded-xl text-center shadow-md">
                              <p className="text-2xl font-bold mb-2">
                                Tu código cada 100 ms = Un rectángulo de Riemann = Un pedacito de la integral
                              </p>
                              <p className="text-lg mt-3">¡Eso es integración numérica en acción! 🎉</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </section>
                  </div>
        )}

                  {/* Contenido de Unidades y Conversión */}
                  {tab === 'unidades' && (
                    <div className="space-y-6">
                      <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-purple-800">
                          Unidades Físicas en Vehículos
                        </h2>

                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">
                              📊 Variables en un Sistema Automotriz
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-blue-50 rounded">
                                <div className="font-semibold text-blue-800">Entrada del Sensor:</div>
                                <div className="text-2xl font-bold text-blue-600">km/h</div>
                                <div className="text-sm text-gray-600 mt-1">Velocidad del velocímetro</div>
                              </div>
                              <div className="p-3 bg-green-50 rounded">
                                <div className="font-semibold text-green-800">Salida del Cálculo:</div>
                                <div className="text-2xl font-bold text-green-600">km</div>
                                <div className="text-sm text-gray-600 mt-1">Distancia en el odómetro</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">
                              🔄 El Problema de las Unidades
                            </h3>
                            <div className="space-y-3">
                              <div className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
                                <p className="font-semibold mb-2">La velocidad está en km/h, pero...</p>
                                <p className="text-gray-700">
                                  Nuestro sistema muestrea cada <strong>100 milisegundos</strong> (0.1 segundos).
                                </p>
                                <p className="text-gray-700 mt-2">
                                  ⚠️ No podemos multiplicar directamente <strong>km/h × segundos</strong> porque las unidades no son compatibles.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">
                              ✅ Solución: Conversión de Unidades
                            </h3>

                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 rounded">
                                <p className="font-semibold mb-3">Opción 1: Convertir velocidad a km/s</p>
                                <div className="bg-white p-3 rounded font-mono text-sm border">
                                  <div className="text-gray-600">// Datos de entrada</div>
                                  <div>velocidad_kmh = 50;  <span className="text-gray-500">// del sensor (km/h)</span></div>
                                  <div>dt = 0.1;  <span className="text-gray-500">// intervalo en segundos</span></div>
                                  <div className="mt-2 text-blue-600">// Conversión</div>
                                  <div>velocidad_kms = velocidad_kmh / 3600;</div>
                                  <div className="text-gray-500">// 50 km/h ÷ 3600 = 0.01389 km/s</div>
                                  <div className="mt-2 text-green-600">// Cálculo</div>
                                  <div>distancia_km = velocidad_kms × dt;</div>
                                  <div className="text-gray-500">// 0.01389 × 0.1 = 0.001389 km</div>
                                  <div className="mt-2">odometro += distancia_km;</div>
                                </div>
                              </div>

                              <div className="p-4 bg-blue-50 rounded">
                                <p className="font-semibold mb-3">Opción 2: Convertir tiempo a horas</p>
                                <div className="bg-white p-3 rounded font-mono text-sm border">
                                  <div className="text-gray-600">// Datos de entrada</div>
                                  <div>velocidad_kmh = 50;  <span className="text-gray-500">// del sensor (km/h)</span></div>
                                  <div>dt_segundos = 0.1;</div>
                                  <div className="mt-2 text-blue-600">// Conversión</div>
                                  <div>dt_horas = dt_segundos / 3600;</div>
                                  <div className="text-gray-500">// 0.1 s ÷ 3600 = 0.0000278 horas</div>
                                  <div className="mt-2 text-green-600">// Cálculo</div>
                                  <div>distancia_km = velocidad_kmh × dt_horas;</div>
                                  <div className="text-gray-500">// 50 × 0.0000278 = 0.001389 km</div>
                                  <div className="mt-2">odometro += distancia_km;</div>
                                </div>
                              </div>

                              <div className="p-4 bg-purple-50 rounded border-l-4 border-purple-500">
                                <p className="font-semibold mb-2">💡 Ambas opciones dan el mismo resultado</p>
                                <p className="text-gray-700">
                                  En la práctica, la <strong>Opción 1</strong> es más común porque solo conviertes una vez al inicio del programa,
                                  en lugar de convertir el tiempo en cada iteración.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">
                              📐 Análisis Dimensional
                            </h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded">
                                <p className="font-semibold mb-2">Verificación de unidades:</p>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-white px-2 py-1 rounded">[km/h] × [h]</span>
                                    <span>=</span>
                                    <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">[km] ✓</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-white px-2 py-1 rounded">[km/s] × [s]</span>
                                    <span>=</span>
                                    <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">[km] ✓</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-white px-2 py-1 rounded">[km/h] × [s]</span>
                                    <span>=</span>
                                    <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-700">[km·s/h] ✗</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🎯 Resumen para Implementación</h3>
                            <div className="bg-white/10 p-4 rounded mt-3">
                              <ol className="list-decimal ml-5 space-y-2">
                                <li>Lee la velocidad del sensor (en km/h)</li>
                                <li>Convierte a km/s dividiendo entre 3600</li>
                                <li>Multiplica por el intervalo de tiempo (0.1 segundos)</li>
                                <li>Acumula el resultado en el odómetro (en km)</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {/* Contenido de Teoría */}
                  {tab === 'teoria' && (
                    <div className="space-y-6">
                      <section className="bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">
                          Fundamento Matemático
                        </h2>
                        <div className="space-y-4 text-gray-800">
                          <div>
                            <h3 className="font-bold text-lg mb-2">Relación Fundamental:</h3>

                            {/* Cómo se lee la fórmula */}
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-5 rounded-lg border-2 border-purple-300 mb-4">
                              <h4 className="font-bold text-purple-800 mb-3 text-lg">📖 Cómo se lee la fórmula:</h4>
                              <div className="bg-white p-4 rounded space-y-2 text-base leading-relaxed">
                                <p className="font-semibold text-gray-800">
                                  "La posición <span className="text-blue-600">(s)</span> en el tiempo <span className="text-blue-600">(t)</span> es igual a <span className="text-green-600">(=)</span> la posición inicial <span className="text-orange-600">(s₀)</span> más <span className="text-green-600">(+)</span> la integral <span className="text-purple-600">(∫)</span> desde cero <span className="text-purple-600">(₀)</span> hasta te <span className="text-purple-600">(ᵗ)</span> de la velocidad <span className="text-red-600">(v)</span> evaluada en tau <span className="text-red-600">(τ)</span> con respecto a de tau <span className="text-red-600">(dτ)</span>"
                                </p>

                                <div className="border-t pt-3 mt-3">
                                  <p className="font-semibold text-gray-700 mb-2">Versión más natural:</p>
                                  <p className="italic text-gray-800">
                                    "La distancia recorrida hasta el tiempo te, es igual a donde empezaste, más la suma continua de todas las velocidades por sus tiempos, desde cero hasta te"
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* La fórmula con explicaciones */}
                            <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                              <p className="mb-3 font-semibold">Si conocemos la velocidad v(t), la distancia recorrida es:</p>
                              <p className="text-2xl text-center my-4 font-bold text-blue-900">
                                s(t) = s₀ + ∫₀ᵗ v(τ) dτ
                              </p>

                              {/* Desglose de cada término */}
                              <div className="mt-4 space-y-2 text-sm bg-gray-50 p-4 rounded">
                                <p className="font-semibold mb-3 text-gray-700">Significado de cada símbolo:</p>
                                <div className="grid gap-2">
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-blue-600 min-w-[60px]">s(t)</span>
                                    <span className="text-gray-700">= posición (distancia) en función del tiempo t</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-green-600 min-w-[60px]">=</span>
                                    <span className="text-gray-700">= es igual a</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-orange-600 min-w-[60px]">s₀</span>
                                    <span className="text-gray-700">= posición inicial (donde empezaste, usualmente 0)</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-green-600 min-w-[60px]">+</span>
                                    <span className="text-gray-700">= más</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-purple-600 min-w-[60px]">∫₀ᵗ</span>
                                    <span className="text-gray-700">= integral (suma continua) desde 0 hasta t</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-red-600 min-w-[60px]">v(τ)</span>
                                    <span className="text-gray-700">= velocidad en cada instante tau (τ es la variable que recorre de 0 a t)</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-red-600 min-w-[60px]">dτ</span>
                                    <span className="text-gray-700">= diferencial de tau (un pedacito infinitesimal de tiempo)</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 bg-blue-50 p-3 rounded">
                                <p className="text-sm font-semibold text-blue-800">
                                  💡 En resumen: ∫ es como un símbolo de suma gigante que dice "suma todas las velocidades multiplicadas por sus tiempos"
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-lg mb-2">El Problema en Programación:</h3>
                            <div className="bg-white p-4 rounded">
                              <p>No tenemos v(t) como función continua, sino como <strong>muestras discretas</strong>:</p>
                              <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>v₀ en t = 0 ms</li>
                                <li>v₁ en t = 100 ms</li>
                                <li>v₂ en t = 200 ms</li>
                                <li>...</li>
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-lg mb-2">Solución: Integración Numérica</h3>

                            {/* Cómo se lee la fórmula de aproximación */}
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-lg border-2 border-green-300 mb-4">
                              <h4 className="font-bold text-green-800 mb-3 text-lg">📖 Cómo se lee la fórmula de aproximación:</h4>
                              <div className="bg-white p-4 rounded space-y-2 text-base leading-relaxed">
                                <p className="font-semibold text-gray-800">
                                  "La posición <span className="text-blue-600">(s)</span> es aproximadamente igual <span className="text-green-600">(≈)</span> a la suma <span className="text-purple-600">(Σ)</span> de todas las velocidades <span className="text-red-600">(vᵢ)</span> en cada instante i, multiplicadas por <span className="text-orange-600">(×)</span> el intervalo de tiempo <span className="text-orange-600">(Δt)</span>"
                                </p>

                                <div className="border-t pt-3 mt-3">
                                  <p className="font-semibold text-gray-700 mb-2">Versión más natural:</p>
                                  <p className="italic text-gray-800">
                                    "La distancia es aproximadamente igual a sumar: velocidad uno por cien milisegundos, más velocidad dos por cien milisegundos, más velocidad tres por cien milisegundos... y así sucesivamente"
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded border-l-4 border-green-500">
                              <p className="mb-2">Aproximamos la integral mediante sumas de Riemann:</p>
                              <p className="text-2xl text-center my-4 font-bold text-green-900">
                                s ≈ Σ vᵢ × Δt
                              </p>

                              {/* Desglose de cada término */}
                              <div className="mt-4 space-y-2 text-sm bg-gray-50 p-4 rounded">
                                <p className="font-semibold mb-3 text-gray-700">Significado de cada símbolo:</p>
                                <div className="grid gap-2">
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-blue-600 min-w-[60px]">s</span>
                                    <span className="text-gray-700">= distancia total recorrida</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-green-600 min-w-[60px]">≈</span>
                                    <span className="text-gray-700">= aproximadamente igual a (no es exacto, pero muy cercano)</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-purple-600 min-w-[60px]">Σ</span>
                                    <span className="text-gray-700">= sigma, símbolo de suma (suma todos los términos)</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-red-600 min-w-[60px]">vᵢ</span>
                                    <span className="text-gray-700">= velocidad en el instante i (i = 0, 1, 2, 3...)</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-orange-600 min-w-[60px]">×</span>
                                    <span className="text-gray-700">= multiplicado por</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-orange-600 min-w-[60px]">Δt</span>
                                    <span className="text-gray-700">= delta te, el intervalo de tiempo (0.1 segundos = 100 milisegundos)</span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3 mt-4">
                                Donde Δt = 0.1 segundos (100 milisegundos)
                              </p>
                              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                                <div>// En código:</div>
                                <div className="text-green-600">distancia += velocidad * 0.1;</div>
                              </div>

                              <div className="mt-4 bg-green-50 p-3 rounded">
                                <p className="text-sm font-semibold text-green-800">
                                  💡 Cada suma (vᵢ × Δt) es como calcular: "si voy a esta velocidad por 0.1 segundos, ¿cuánto avanzo?"
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                            <p className="font-semibold mb-2">💡 Interpretación Geométrica:</p>
                            <p>
                              Cada término vᵢ × Δt representa el <strong>área de un rectángulo</strong>
                              con base Δt y altura vᵢ. La suma de todos estos rectángulos aproxima
                              el área total bajo la curva de velocidad, que es la distancia recorrida.
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {/* Contenido de Simulación */}
                  {tab === 'simulacion' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                          Ejemplo 1: Calculando la Distancia Recorrida (Odómetro)
                        </h2>

                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-lg mb-6">
                          <h3 className="font-bold text-lg mb-3 text-blue-900">🚗 Contexto del Problema</h3>
                          <div className="bg-white p-4 rounded space-y-2">
                            <p><strong>Vehículo:</strong> Autobús urbano</p>
                            <p><strong>Sensor mide:</strong> Velocidad en km/h</p>
                            <p><strong>Queremos calcular:</strong> Distancia total recorrida (odómetro)</p>
                            <p><strong>Frecuencia de muestreo:</strong> Cada 100 milisegundos</p>
                          </div>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-4 mb-6">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={time >= maxTime}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? 'Pausar' : 'Iniciar'}
                          </button>
                          <button
                            onClick={reset}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <RotateCcw size={20} />
                            Reiniciar
                          </button>
                        </div>

                        {/* Valores actuales */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                            <div className="text-sm text-gray-600">Tiempo</div>
                            <div className="text-2xl font-bold text-blue-600">{time.toFixed(1)} s</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                            <div className="text-sm text-gray-600">Velocidad Actual</div>
                            <div className="text-2xl font-bold text-green-600">{velocidadKmH(time).toFixed(1)} km/h</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                            <div className="text-sm text-gray-600">Odómetro</div>
                            <div className="text-2xl font-bold text-purple-600">{odometro.toFixed(4)} km</div>
                            <div className="text-xs text-gray-500 mt-1">({(odometro * 1000).toFixed(1)} metros)</div>
                          </div>
                        </div>

                        {/* Gráfico */}
                        <div className="bg-white p-6 rounded-lg border">
                          <h3 className="font-bold mb-4">Gráfico Velocidad vs Tiempo</h3>
                          <svg width={graphWidth} height={graphHeight} className="border">
                            {/* Ejes */}
                            <line x1="50" y1="20" x2="50" y2="260" stroke="black" strokeWidth="2" />
                            <line x1="50" y1="260" x2="500" y2="260" stroke="black" strokeWidth="2" />

                            {/* Etiquetas de ejes */}
                            <text x="275" y="290" textAnchor="middle" className="text-sm">Tiempo (segundos)</text>
                            <text x="15" y="140" textAnchor="middle" transform="rotate(-90 15 140)" className="text-sm">
                              Velocidad (km/h)
                            </text>

                            {/* Marcas en eje X */}
                            {[0, 2, 4, 6, 8, 10].map(t => (
                              <g key={t}>
                                <line
                                  x1={50 + t * scaleX}
                                  y1="260"
                                  x2={50 + t * scaleX}
                                  y2="265"
                                  stroke="black"
                                />
                                <text
                                  x={50 + t * scaleX}
                                  y="280"
                                  textAnchor="middle"
                                  className="text-xs"
                                >
                                  {t}
                                </text>
                              </g>
                            ))}

                            {/* Marcas en eje Y */}
                            {[0, 10, 20, 30, 40, 50].map(v => (
                              <g key={v}>
                                <line
                                  x1="45"
                                  y1={260 - v * scaleY}
                                  x2="50"
                                  y2={260 - v * scaleY}
                                  stroke="black"
                                />
                                <text
                                  x="40"
                                  y={265 - v * scaleY}
                                  textAnchor="end"
                                  className="text-xs"
                                >
                                  {v}
                                </text>
                              </g>
                            ))}

                            {/* Curva de velocidad teórica */}
                            <path
                              d={Array.from({ length: 101 }, (_, i) => {
                                const t = i * 0.1;
                                const v = velocidadKmH(t);
                                const x = 50 + t * scaleX;
                                const y = 260 - v * scaleY;
                                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                              }).join(' ')}
                              stroke="lightblue"
                              strokeWidth="2"
                              fill="none"
                            />

                            {/* Rectángulos (integración numérica) */}
                            {rectangulos.map((rect, i) => (
                              <rect
                                key={i}
                                x={50 + rect.t * scaleX}
                                y={260 - rect.v * scaleY}
                                width={rect.dt * scaleX}
                                height={rect.v * scaleY}
                                fill="rgba(59, 130, 246, 0.3)"
                                stroke="blue"
                                strokeWidth="1"
                              />
                            ))}

                            {/* Punto actual */}
                            {time > 0 && (
                              <circle
                                cx={50 + time * scaleX}
                                cy={260 - velocidadKmH(time) * scaleY}
                                r="5"
                                fill="red"
                              />
                            )}
                          </svg>

                          <div className="mt-4 p-4 bg-blue-50 rounded">
                            <p className="text-sm">
                              <strong>Los rectángulos azules</strong> representan (v × Δt).
                              El área total de todos los rectángulos = distancia total recorrida = {odometro.toFixed(4)} km
                            </p>
                          </div>
                        </div>

                        {/* Fórmula en acción */}
                        {time > 0 && (
                          <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <h3 className="font-bold mb-2">Código ejecutándose (cada 100 ms):</h3>
                            <div className="font-mono text-sm bg-white p-3 rounded">
                              <div className="text-gray-600">// Lectura del sensor</div>
                              <div>velocidad_kmh = {velocidadKmH(time - dt).toFixed(1)} km/h</div>
                              <div className="mt-2 text-blue-600">// Conversión de unidades</div>
                              <div>velocidad_kms = {velocidadKmH(time - dt).toFixed(1)} / 3600</div>
                              <div>velocidad_kms = {(velocidadKmH(time - dt) / 3600).toFixed(6)} km/s</div>
                              <div className="mt-2 text-gray-600">// Intervalo de tiempo</div>
                              <div>dt = 0.1 segundos</div>
                              <div className="mt-2 text-green-600 font-bold">// Cálculo de distancia</div>
                              <div>distancia = {(velocidadKmH(time - dt) / 3600).toFixed(6)} × 0.1</div>
                              <div>distancia = {((velocidadKmH(time - dt) / 3600) * dt).toFixed(6)} km</div>
                              <div className="mt-2 text-purple-600 font-bold">// Acumulación</div>
                              <div>odometro += {((velocidadKmH(time - dt) / 3600) * dt).toFixed(6)} km</div>
                              <div className="mt-2 pt-2 border-t">
                                <strong>Odómetro total: {odometro.toFixed(4)} km</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contenido de Combustible */}
                  {tab === 'combustible' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                          Ejemplo 2: Calculando el Consumo de Combustible
                        </h2>

                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-5 rounded-lg mb-6">
                          <h3 className="font-bold text-lg mb-3 text-orange-900">🚌 Contexto del Problema</h3>
                          <div className="bg-white p-4 rounded space-y-2">
                            <p><strong>Vehículo:</strong> Autobús urbano</p>
                            <p><strong>Sensor mide:</strong> Fuel Rate (tasa de consumo) en litros/hora</p>
                            <p><strong>Queremos calcular:</strong> Total de litros consumidos</p>
                            <p><strong>Frecuencia de muestreo:</strong> Cada 100 milisegundos</p>
                          </div>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-4 mb-6">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={time >= maxTime}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? 'Pausar' : 'Iniciar'}
                          </button>
                          <button
                            onClick={reset}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <RotateCcw size={20} />
                            Reiniciar
                          </button>
                        </div>

                        {/* Valores actuales */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                            <div className="text-sm text-gray-600">Tiempo</div>
                            <div className="text-2xl font-bold text-blue-600">{time.toFixed(1)} s</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                            <div className="text-sm text-gray-600">Velocidad</div>
                            <div className="text-2xl font-bold text-green-600">{velocidadKmH(time).toFixed(1)} km/h</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                            <div className="text-sm text-gray-600">Fuel Rate Actual</div>
                            <div className="text-2xl font-bold text-orange-600">{fuelRateLPorH(time).toFixed(2)} L/h</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                            <div className="text-sm text-gray-600">Litros Consumidos</div>
                            <div className="text-2xl font-bold text-red-600">{litrosConsumidos.toFixed(6)} L</div>
                          </div>
                        </div>

                        {/* Comparación con distancia */}
                        <div className="bg-purple-50 p-4 rounded-lg mb-6 border-2 border-purple-300">
                          <h3 className="font-bold mb-2 text-purple-900">📊 Datos Calculados</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded">
                              <p className="text-sm text-gray-600">Distancia recorrida:</p>
                              <p className="text-xl font-bold text-blue-600">{odometro.toFixed(4)} km</p>
                            </div>
                            <div className="bg-white p-3 rounded">
                              <p className="text-sm text-gray-600">Litros consumidos:</p>
                              <p className="text-xl font-bold text-red-600">{litrosConsumidos.toFixed(6)} L</p>
                            </div>
                          </div>
                          <div className="mt-3 bg-yellow-100 p-3 rounded">
                            <p className="text-sm text-gray-700">
                              💡 Con estos dos valores podemos calcular el <strong>rendimiento</strong> usando una regla de 3
                            </p>
                          </div>
                        </div>

                        {/* Gráfico de Fuel Rate */}
                        <div className="bg-white p-6 rounded-lg border">
                          <h3 className="font-bold mb-4">Gráfico Fuel Rate vs Tiempo</h3>
                          <svg width={graphWidth} height={graphHeight} className="border">
                            {/* Ejes */}
                            <line x1="50" y1="20" x2="50" y2="260" stroke="black" strokeWidth="2" />
                            <line x1="50" y1="260" x2="500" y2="260" stroke="black" strokeWidth="2" />

                            {/* Etiquetas de ejes */}
                            <text x="275" y="290" textAnchor="middle" className="text-sm">Tiempo (segundos)</text>
                            <text x="15" y="140" textAnchor="middle" transform="rotate(-90 15 140)" className="text-sm">
                              Fuel Rate (L/h)
                            </text>

                            {/* Marcas en eje X */}
                            {[0, 2, 4, 6, 8, 10].map(t => (
                              <g key={t}>
                                <line
                                  x1={50 + t * scaleX}
                                  y1="260"
                                  x2={50 + t * scaleX}
                                  y2="265"
                                  stroke="black"
                                />
                                <text
                                  x={50 + t * scaleX}
                                  y="280"
                                  textAnchor="middle"
                                  className="text-xs"
                                >
                                  {t}
                                </text>
                              </g>
                            ))}

                            {/* Marcas en eje Y - ajustadas para fuel rate */}
                            {[0, 5, 10, 15, 20].map(v => (
                              <g key={v}>
                                <line
                                  x1="45"
                                  y1={260 - v * 12}
                                  x2="50"
                                  y2={260 - v * 12}
                                  stroke="black"
                                />
                                <text
                                  x="40"
                                  y={265 - v * 12}
                                  textAnchor="end"
                                  className="text-xs"
                                >
                                  {v}
                                </text>
                              </g>
                            ))}

                            {/* Curva de fuel rate teórica */}
                            <path
                              d={Array.from({ length: 101 }, (_, i) => {
                                const t = i * 0.1;
                                const fr = fuelRateLPorH(t);
                                const x = 50 + t * scaleX;
                                const y = 260 - fr * 12;
                                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                              }).join(' ')}
                              stroke="lightsalmon"
                              strokeWidth="2"
                              fill="none"
                            />

                            {/* Rectángulos (integración numérica) */}
                            {rectangulosCombustible.map((rect, i) => (
                              <rect
                                key={i}
                                x={50 + rect.t * scaleX}
                                y={260 - rect.v * 12}
                                width={rect.dt * scaleX}
                                height={rect.v * 12}
                                fill="rgba(255, 140, 0, 0.3)"
                                stroke="orange"
                                strokeWidth="1"
                              />
                            ))}

                            {/* Punto actual */}
                            {time > 0 && (
                              <circle
                                cx={50 + time * scaleX}
                                cy={260 - fuelRateLPorH(time) * 12}
                                r="5"
                                fill="red"
                              />
                            )}
                          </svg>

                          <div className="mt-4 p-4 bg-orange-50 rounded">
                            <p className="text-sm">
                              <strong>Los rectángulos naranjas</strong> representan (Fuel Rate × Δt).
                              El área total = litros totales consumidos = {litrosConsumidos.toFixed(6)} L
                            </p>
                          </div>
                        </div>

                        {/* Conversión de unidades para combustible */}
                        <div className="mt-6 bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
                          <h3 className="font-bold mb-3 text-yellow-900">🔧 Conversión de Unidades</h3>
                          <div className="bg-white p-4 rounded space-y-3">
                            <div>
                              <p className="font-semibold mb-2">El sensor da: Fuel Rate en L/h</p>
                              <p className="text-sm text-gray-700">Pero nuestro Δt está en segundos (0.1 s)</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="font-semibold text-blue-800 mb-2">Solución:</p>
                              <div className="font-mono text-sm space-y-1">
                                <p>fuel_rate_Lh = {time > 0 ? fuelRateLPorH(time - dt).toFixed(2) : '0.00'} L/h</p>
                                <p className="text-blue-600">fuel_rate_Ls = fuel_rate_Lh / 3600</p>
                                <p>fuel_rate_Ls = {time > 0 ? (fuelRateLPorH(time - dt) / 3600).toFixed(8) : '0.00000000'} L/s</p>
                                <p className="text-green-600 font-bold mt-2">litros = fuel_rate_Ls × 0.1 s</p>
                                <p>litros = {time > 0 ? ((fuelRateLPorH(time - dt) / 3600) * dt).toFixed(8) : '0.00000000'} L</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Código ejecutándose */}
                        {time > 0 && (
                          <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                            <h3 className="font-bold mb-2">Código ejecutándose (cada 100 ms):</h3>
                            <div className="font-mono text-sm bg-white p-3 rounded">
                              <div className="text-gray-600">// Lectura del sensor</div>
                              <div>fuel_rate_Lh = {fuelRateLPorH(time - dt).toFixed(2)} L/h</div>
                              <div className="mt-2 text-blue-600">// Conversión de unidades</div>
                              <div>fuel_rate_Ls = {fuelRateLPorH(time - dt).toFixed(2)} / 3600</div>
                              <div>fuel_rate_Ls = {(fuelRateLPorH(time - dt) / 3600).toFixed(8)} L/s</div>
                              <div className="mt-2 text-gray-600">// Intervalo de tiempo</div>
                              <div>dt = 0.1 segundos</div>
                              <div className="mt-2 text-green-600 font-bold">// Cálculo de litros</div>
                              <div>litros = {(fuelRateLPorH(time - dt) / 3600).toFixed(8)} × 0.1</div>
                              <div>litros = {((fuelRateLPorH(time - dt) / 3600) * dt).toFixed(8)} L</div>
                              <div className="mt-2 text-orange-600 font-bold">// Acumulación</div>
                              <div>total_litros += {((fuelRateLPorH(time - dt) / 3600) * dt).toFixed(8)} L</div>
                              <div className="mt-2 pt-2 border-t">
                                <strong>Total acumulado: {litrosConsumidos.toFixed(6)} L</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fórmula matemática */}
                        <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 p-5 rounded-lg">
                          <h3 className="font-bold text-lg mb-3 text-orange-900">📐 Fórmula Matemática</h3>

                          <div className="bg-white p-4 rounded mb-4">
                            <p className="text-center text-sm text-gray-600 mb-2">Litros consumidos:</p>
                            <p className="text-center text-2xl font-bold text-orange-800">
                              L(t) = L₀ + ∫₀ᵗ FR(τ) dτ
                            </p>
                            <p className="text-center text-sm text-gray-600 mt-2">
                              Donde FR(τ) es el Fuel Rate en litros/segundo
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded">
                            <p className="text-center text-sm text-gray-600 mb-2">Aproximación numérica:</p>
                            <p className="text-center text-2xl font-bold text-red-800">
                              L ≈ Σ FRᵢ × Δt
                            </p>
                            <p className="text-center text-sm text-gray-600 mt-2">
                              Igual que con la distancia, ¡pero ahora sumamos fuel rate!
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Contenido de Rendimiento */}
                  {tab === 'rendimiento' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                          Ejemplo 3: Calculando el Rendimiento (km/L)
                        </h2>

                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-lg mb-6">
                          <h3 className="font-bold text-lg mb-3 text-green-900">🎯 Objetivo</h3>
                          <div className="bg-white p-4 rounded space-y-2">
                            <p><strong>Pregunta:</strong> ¿Cuántos kilómetros recorro con 1 litro de combustible?</p>
                            <p><strong>Datos que tenemos:</strong></p>
                            <ul className="ml-6 list-disc space-y-1">
                              <li>Distancia total recorrida (de la integración de velocidad)</li>
                              <li>Litros totales consumidos (de la integración de fuel rate)</li>
                            </ul>
                            <p className="mt-3"><strong>Método:</strong> Regla de 3 simple</p>
                          </div>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-4 mb-6">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={time >= maxTime}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? 'Pausar' : 'Iniciar'}
                          </button>
                          <button
                            onClick={reset}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <RotateCcw size={20} />
                            Reiniciar
                          </button>
                        </div>

                        {/* Datos de entrada */}
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">📊 Datos Calculados (Entradas)</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-300">
                              <p className="text-sm text-gray-600 mb-2">Distancia Total Recorrida</p>
                              <p className="text-xs text-gray-500 mb-2">(Del Ejemplo 1: Integración de Velocidad)</p>
                              <p className="text-3xl font-bold text-blue-600">{odometro.toFixed(4)} km</p>
                            </div>
                            <div className="bg-red-50 p-5 rounded-lg border-2 border-red-300">
                              <p className="text-sm text-gray-600 mb-2">Litros Totales Consumidos</p>
                              <p className="text-xs text-gray-500 mb-2">(Del Ejemplo 2: Integración de Fuel Rate)</p>
                              <p className="text-3xl font-bold text-red-600">{litrosConsumidos.toFixed(6)} L</p>
                            </div>
                          </div>
                        </div>

                        {/* Regla de 3 explicada */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-6">
                          <h3 className="font-bold text-xl mb-4 text-purple-900">📐 Regla de 3 Simple</h3>

                          <div className="bg-white p-5 rounded-lg mb-4">
                            <p className="font-semibold mb-3 text-gray-800">Planteamiento:</p>
                            <div className="space-y-3 text-lg">
                              <div className="flex items-center justify-center gap-4">
                                <div className="bg-red-100 px-4 py-2 rounded">
                                  <span className="font-bold text-red-700">{litrosConsumidos.toFixed(6)} L</span>
                                </div>
                                <span className="text-2xl">→</span>
                                <div className="bg-blue-100 px-4 py-2 rounded">
                                  <span className="font-bold text-blue-700">{odometro.toFixed(4)} km</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-center gap-4">
                                <div className="bg-green-100 px-4 py-2 rounded">
                                  <span className="font-bold text-green-700">1 L</span>
                                </div>
                                <span className="text-2xl">→</span>
                                <div className="bg-yellow-100 px-4 py-2 rounded">
                                  <span className="font-bold text-yellow-700">X km</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-lg">
                            <p className="font-semibold mb-3 text-gray-800">Resolución:</p>
                            <div className="space-y-3 font-mono text-base bg-gray-50 p-4 rounded">
                              <div className="text-center text-xl">
                                <p className="mb-2">X = (1 × {odometro.toFixed(4)}) / {litrosConsumidos.toFixed(6)}</p>
                                {litrosConsumidos > 0 && (
                                  <>
                                    <p className="mb-2">X = {odometro.toFixed(4)} / {litrosConsumidos.toFixed(6)}</p>
                                    <div className="bg-green-100 p-3 rounded mt-3">
                                      <p className="text-2xl font-bold text-green-700">
                                        X = {(odometro / litrosConsumidos).toFixed(2)} km/L
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resultado final */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-xl mb-6">
                          <h3 className="text-2xl font-bold mb-4">🎉 Resultado: Rendimiento Calculado</h3>
                          <div className="bg-white/20 p-5 rounded-lg text-center">
                            {litrosConsumidos > 0 ? (
                              <>
                                <p className="text-4xl font-bold mb-2">
                                  {(odometro / litrosConsumidos).toFixed(2)} km/L
                                </p>
                                <p className="text-lg">
                                  El vehículo recorre {(odometro / litrosConsumidos).toFixed(2)} kilómetros por cada litro de combustible
                                </p>
                              </>
                            ) : (
                              <p className="text-xl">Inicia la simulación para ver el rendimiento calculado</p>
                            )}
                          </div>
                        </div>

                        {/* Fórmula general */}
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">📖 Fórmula General</h3>

                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border-2 border-blue-200">
                            <p className="text-center text-sm text-gray-600 mb-3">Rendimiento (km/L) se calcula como:</p>
                            <p className="text-center text-3xl font-bold text-blue-900 mb-4">
                              R = Distancia / Litros
                            </p>
                            <div className="bg-white p-4 rounded space-y-2 text-sm">
                              <p><strong>R</strong> = Rendimiento en kilómetros por litro</p>
                              <p><strong>Distancia</strong> = Kilómetros totales recorridos (∫ velocidad dt)</p>
                              <p><strong>Litros</strong> = Litros totales consumidos (∫ fuel rate dt)</p>
                            </div>
                          </div>
                        </div>

                        {/* En código */}
                        <div className="bg-gray-800 text-white p-6 rounded-lg">
                          <h3 className="font-bold text-lg mb-4">💻 En Código</h3>
                          <div className="font-mono text-sm space-y-2">
                            <p className="text-gray-400">// Después de calcular distancia y litros con integración numérica:</p>
                            <p className="text-green-400">const distanciaTotal = {odometro.toFixed(4)}; <span className="text-gray-400">// km</span></p>
                            <p className="text-red-400">const litrosTotal = {litrosConsumidos.toFixed(6)}; <span className="text-gray-400">// L</span></p>
                            <p className="mt-3"></p>
                            <p className="text-yellow-400">// Regla de 3:</p>
                            <p className="text-white">const rendimiento = distanciaTotal / litrosTotal;</p>
                            {litrosConsumidos > 0 && (
                              <p className="text-cyan-400">// rendimiento = {(odometro / litrosConsumidos).toFixed(2)} km/L</p>
                            )}
                          </div>
                        </div>

                        {/* Conexión con los ejemplos anteriores */}
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg border-l-4 border-yellow-500">
                          <h3 className="font-bold text-lg mb-3 text-orange-900">🔗 Conectando los Tres Ejemplos</h3>
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded flex items-start gap-3">
                              <span className="text-2xl">1️⃣</span>
                              <div>
                                <p className="font-semibold text-blue-800">Ejemplo 1: Distancia</p>
                                <p className="text-sm text-gray-700">Integramos <strong>velocidad</strong> → obtenemos <strong>km recorridos</strong></p>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded flex items-start gap-3">
                              <span className="text-2xl">2️⃣</span>
                              <div>
                                <p className="font-semibold text-red-800">Ejemplo 2: Combustible</p>
                                <p className="text-sm text-gray-700">Integramos <strong>fuel rate</strong> → obtenemos <strong>litros consumidos</strong></p>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded flex items-start gap-3">
                              <span className="text-2xl">3️⃣</span>
                              <div>
                                <p className="font-semibold text-green-800">Ejemplo 3: Rendimiento</p>
                                <p className="text-sm text-gray-700">Dividimos <strong>km / litros</strong> → obtenemos <strong>km/L (rendimiento)</strong></p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 bg-white p-4 rounded">
                            <p className="font-semibold text-gray-800 mb-2">✨ La magia:</p>
                            <p className="text-sm text-gray-700">
                              Usando solo <strong>integración numérica</strong> en dos variables diferentes (velocidad y fuel rate),
                              podemos calcular una tercera variable derivada (rendimiento) usando álgebra simple.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Contenido de Aplicación Real */}
                  {tab === 'aplicacion' && (
                    <div className="space-y-8 animate-fade-in">
                      <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                          <h2 className="text-3xl font-bold flex items-center gap-3">
                            <span className="text-4xl">🚌</span> Aplicación en Escenario Real
                          </h2>
                          <p className="mt-2 text-blue-100 text-lg">
                            Visualización y análisis de datos telemétricos de un autobús en operación.
                          </p>
                        </div>

                        <div className="p-8">
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
                            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                              <span>📊</span> Visualizador de Datos Reales
                            </h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              Esta herramienta te permite analizar datos reales capturados de un autobús en operación.
                              Los datos incluyen velocidad, fuel rate, distancia y consumo de combustible medidos cada 100 milisegundos.
                            </p>

                            <div className="bg-white p-5 rounded-xl shadow-sm">
                              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Funcionalidades:</h4>
                              <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  Cargar archivos CSV con datos reales del vehículo
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  Ver en tiempo real cómo se aplica la integración numérica
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  Comparar valores medidos por sensores vs. calculados
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  Analizar el rendimiento del vehículo en condiciones reales
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  Controlar la velocidad de reproducción (1x, 10x, 50x, 100x, 500x)
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <span className="text-xs text-gray-400 font-mono ml-2">visualizador_simplificado.html</span>
                            </div>
                            <iframe
                              src={iframeUrl}
                              className="w-full bg-white"
                              style={{ height: '1200px' }}
                              title="Visualizador de Datos Reales"
                            />
                          </div>

                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mt-8 border border-indigo-100">
                            <h3 className="font-bold text-lg mb-3 text-indigo-900 flex items-center gap-2">
                              <span>🎓</span> Objetivo Didáctico
                            </h3>
                            <p className="text-gray-700 mb-4">
                              Esta aplicación demuestra cómo los conceptos matemáticos teóricos que vimos en las pestañas
                              anteriores se aplican directamente a datos reales de vehículos en operación.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
                                <p className="font-bold text-gray-900 mb-1">✓ Teoría</p>
                                <p className="text-gray-600">Aprendiste las fórmulas y conceptos de integración numérica</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-green-500">
                                <p className="font-bold text-gray-900 mb-1">✓ Ejemplos</p>
                                <p className="text-gray-600">Viste simulaciones con datos sintéticos</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
                                <p className="font-bold text-gray-900 mb-1">✓ Práctica</p>
                                <p className="text-gray-600">Ahora aplicas todo con datos reales de sensores automotrices</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
              );
};

              export default IntegralOdometro;