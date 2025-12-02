import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';

/**
 * VisualizadorSimplificado.tsx
 * Portado desde visualizador_simplificado.html y adaptado a React + TypeScript.
 *
 * Funcionalidad:
 * - Cargar CSV local (input file)
 * - Inicializar charts con Chart.js
 * - Reproducir/pausar/reset con control de velocidad y slider
 * - Actualizar paneles de métricas y comparaciones
 *
 * Nota: este componente está pensado para reemplazar el iframe en la pestaña
 * "Escenario Real" para integrar el visualizador dentro de la app React.
 */

type AnyChart = any;

export default function VisualizadorSimplificado() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInfo, setFileInfo] = useState<string>('');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(10);
  const [sliderMax, setSliderMax] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Chart refs
  const fuelRateChartRef = useRef<AnyChart | null>(null);
  const speedChartRef = useRef<AnyChart | null>(null);
  const fuelAccumChartRef = useRef<AnyChart | null>(null);
  const distanceChartRef = useRef<AnyChart | null>(null);
  const efficiencyChartRef = useRef<AnyChart | null>(null);
  const fuelComparisonChartRef = useRef<AnyChart | null>(null);

  // Canvas refs
  const fuelRateCanvas = useRef<HTMLCanvasElement | null>(null);
  const speedCanvas = useRef<HTMLCanvasElement | null>(null);
  const fuelAccumCanvas = useRef<HTMLCanvasElement | null>(null);
  const distanceCanvas = useRef<HTMLCanvasElement | null>(null);
  const efficiencyCanvas = useRef<HTMLCanvasElement | null>(null);
  const fuelComparisonCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopPlayback();
      destroyCharts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      setSliderMax(csvData.length - 1);
      initCharts();
      resetPlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvData]);

  // Cargar por defecto el archivo embebido (Recorrido_1.txt) desde public para poder dar Play inmediatamente
  useEffect(() => {
    // Si ya hay datos cargados, no hacer nada
    if (csvData.length > 0) return;
    fetch(`${import.meta.env.BASE_URL}Recorrido_1.txt`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró Recorrido_1.txt en /public');
        return res.text();
      })
      .then(text => {
        // Papa.parse acepta string directamente
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const data = results.data || [];
            setCsvData(data);
            setFileInfo(`Embedded: Recorrido_1.txt — ${data.length} registros`);
          },
          error: (err: any) => {
            console.error('Error parseando archivo embebido', err);
            setFileInfo('Error parseando embedded Recorrido_1.txt');
          }
        });
      })
      .catch(err => {
        console.error('Error fetching embedded Recorrido_1.txt', err);
      });
  }, []);

  function initCharts() {
    destroyCharts();
    const common: any = { animation: false, responsive: true };

    if (fuelRateCanvas.current) {
      fuelRateChartRef.current = new Chart(fuelRateCanvas.current, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Fuel Rate (L/h)', data: [], borderColor: '#fb923c', backgroundColor: 'rgba(251,146,60,0.2)' }] },
        options: common
      });
    }

    if (speedCanvas.current) {
      speedChartRef.current = new Chart(speedCanvas.current, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Velocidad (km/h)', data: [], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' }] },
        options: common
      });
    }

    if (fuelAccumCanvas.current) {
      fuelAccumChartRef.current = new Chart(fuelAccumCanvas.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            { label: 'Sensor', data: [], borderColor: '#3b82f6' },
            { label: 'Calculado', data: [], borderColor: '#22c55e', borderDash: [5, 5] }
          ]
        },
        options: common
      });
    }

    if (distanceCanvas.current) {
      distanceChartRef.current = new Chart(distanceCanvas.current, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Distancia (km)', data: [], borderColor: '#ef4444' }] },
        options: common
      });
    }

    if (efficiencyCanvas.current) {
      efficiencyChartRef.current = new Chart(efficiencyCanvas.current, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Rendimiento (km/L)', data: [], borderColor: '#a855f7' }] },
        options: common
      });
    }

    if (fuelComparisonCanvas.current) {
      fuelComparisonChartRef.current = new Chart(fuelComparisonCanvas.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            { label: 'Sensor', data: [], borderColor: '#3b82f6' },
            { label: 'Calculado', data: [], borderColor: '#22c55e', borderDash: [5, 5] }
          ]
        },
        options: common
      });
    }
  }

  function destroyCharts() {
    [fuelRateChartRef, speedChartRef, fuelAccumChartRef, distanceChartRef, efficiencyChartRef, fuelComparisonChartRef].forEach(ref => {
      if (ref.current) {
        try { ref.current.destroy(); } catch (e) { /* ignore */ }
        ref.current = null;
      }
    });
  }

  function parseFile(file: File) {
    setFileInfo('Parsing...');
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        setCsvData(results.data || []);
        setFileInfo(`${file.name} — ${results.data.length} registros`);
      },
      error: (err: any) => {
        console.error(err);
        setFileInfo('Error parseando CSV');
      }
    });
  }

  function handleLoad() {
    const f = fileInputRef.current?.files?.[0];
    if (!f) return alert('Selecciona un CSV');
    parseFile(f);
  }

  function getAvgDt(data: any[]) {
    let total = 0; let count = 0;
    for (let i = 1; i < Math.min(200, data.length); i++) {
      const d = Number(data[i].Time) - Number(data[i-1].Time);
      if (!isNaN(d) && d > 0) { total += d; count++; }
    }
    return count > 0 ? total / count : 1.0;
  }

  function startPlayback() {
    if (!csvData.length) return;
    if (isPlaying) return;
    setIsPlaying(true);
    const avgDt = getAvgDt(csvData);
    const intervalMs = Math.max(10, (avgDt * 1000) / speed);
    animationRef.current = window.setInterval(() => {
      setCurrentIndex(idx => {
        const next = Math.min(csvData.length - 1, idx + 1);
        updateDisplays(next);
        updateChartsIncremental(next);
        updateProgress(next);
        if (next >= csvData.length - 1) stopPlayback();
        return next;
      });
    }, intervalMs);
  }

  function pausePlayback() {
    setIsPlaying(false);
    if (animationRef.current) { window.clearInterval(animationRef.current); animationRef.current = null; }
  }

  function stopPlayback() {
    pausePlayback();
    setCurrentIndex(0);
  }

  function resetPlayback() {
    stopPlayback();
    destroyCharts();
    initCharts();
    updateDisplays(0);
    updateProgress(0);
  }

  function updateDisplays(idx: number) {
    const row = csvData[idx];
    if (!row) return;
    const time = Number(row.Time || 0);
    const speedV = Number(row['Wheel-Based Vehicle Speed (kph)'] || 0);
    const distM = Number(row['High Resolution Total Vehicle Distance (m)'] || 0);
    const sensorFuel = Number(row['Engine Total Fuel Used (l)'] || 0);
    const calcFuel = Number(row['Combustible Calculado (l)'] || 0);

    const currentValuesEl = document.getElementById('currentValues');
    if (currentValuesEl) currentValuesEl.classList.remove('hidden');

    const elTime = document.getElementById('currentTime');
    const elSpeed = document.getElementById('currentSpeed');
    const elDistance = document.getElementById('currentDistance');

    // Los datos de origen están en km aunque la etiqueta diga "m" -> tratamos esos valores como km
    const initialDist = Number(csvData[0]?.['High Resolution Total Vehicle Distance (m)'] || 0);
    const deltaDist = distM - initialDist;

    if (elTime) elTime.textContent = `${time.toFixed(1)} s`;
    if (elSpeed) elSpeed.textContent = `${speedV.toFixed(1)} km/h`;
    if (elDistance) elDistance.textContent = `${deltaDist.toFixed(3)} km`;

    // Actualizar Fuel Rate (L/h) en panel de valores actuales
    const elFuelRate = document.getElementById('currentFuelRate');
    const fuelRateNow = Number(row['Engine Fuel Rate (l/h)'] || 0);
    if (elFuelRate) elFuelRate.textContent = `${fuelRateNow.toFixed(1)} L/h`;
    
    const elSensor = document.getElementById('sensorFuel');
    const elCalc = document.getElementById('calculatedFuel');
    if (elSensor) elSensor.textContent = `${(sensorFuel - (csvData[0]['Engine Total Fuel Used (l)']||0)).toFixed(4)} L`;
    if (elCalc) elCalc.textContent = `${(calcFuel - (csvData[0]['Combustible Calculado (l)']||0)).toFixed(4)} L`;

    const elEff = document.getElementById('efficiencyCalculated');
    const deltaCalc = calcFuel - (csvData[0]['Combustible Calculado (l)']||0);
    const eff = deltaCalc > 0 ? deltaDist / deltaCalc : 0;
    if (elEff) elEff.textContent = `${eff.toFixed(6)} km/L`;
  }

  function updateProgress(idx: number) {
    if (!csvData.length) return;
    const current = Number(csvData[idx].Time || 0);
    const total = Number(csvData[csvData.length - 1].Time || 0);
    const pct = (idx / (csvData.length - 1)) * 100;
    const el = document.getElementById('progressText');
    if (el) el.textContent = `${current.toFixed(1)} s / ${total.toFixed(1)} s (${pct.toFixed(1)}%)`;
    setSliderMax(csvData.length - 1);
  }

  function updateChartsIncremental(idx: number) {
    if (!csvData.length) return;
    const row = csvData[idx];
    if (!row) return;
    const time = Number(row.Time || 0);
    const fuelRate = Number(row['Engine Fuel Rate (l/h)'] || 0);
    const speedV = Number(row['Wheel-Based Vehicle Speed (kph)'] || 0);
    const distM = Number(row['High Resolution Total Vehicle Distance (m)'] || 0);
    const sensorFuel = Number(row['Engine Total Fuel Used (l)'] || 0);
    const calcFuel = Number(row['Combustible Calculado (l)'] || 0);

    const push = (ref: any, label: string, value: number) => {
      if (!ref?.current) return;
      ref.current.data.labels.push(label);
      ref.current.data.datasets[0].data.push(value);
      if (ref.current.data.labels.length > 200) {
        ref.current.data.labels.shift();
        ref.current.data.datasets[0].data.shift();
      }
      ref.current.update('none');
    };

    push(fuelRateChartRef, time.toFixed(1), fuelRate);
    push(speedChartRef, time.toFixed(1), speedV);

    // Los datos de distancia están en km (la etiqueta dice "m"); calculamos delta con el valor tal cual (km)
    const initial = csvData[0] || {};
    const initialDist = Number(initial['High Resolution Total Vehicle Distance (m)'] || 0);
    const deltaDist = distM - initialDist;
    push(distanceChartRef, time.toFixed(1), deltaDist);

    // fuel accumulated & comparison
    const deltaSensor = sensorFuel - (initial['Engine Total Fuel Used (l)'] || 0);
    const deltaCalc = calcFuel - (initial['Combustible Calculado (l)'] || 0);

    if (fuelAccumChartRef.current) {
      fuelAccumChartRef.current.data.labels.push(time.toFixed(1));
      fuelAccumChartRef.current.data.datasets[0].data.push(deltaSensor);
      fuelAccumChartRef.current.data.datasets[1].data.push(deltaCalc);
      fuelAccumChartRef.current.update('none');
    }
    if (fuelComparisonChartRef.current) {
      fuelComparisonChartRef.current.data.labels.push(time.toFixed(1));
      fuelComparisonChartRef.current.data.datasets[0].data.push(deltaSensor);
      fuelComparisonChartRef.current.data.datasets[1].data.push(deltaCalc);
      fuelComparisonChartRef.current.update('none');
    }
    const efficiency = deltaCalc > 0 ? deltaDist / deltaCalc : 0;
    if (efficiencyChartRef.current) {
      efficiencyChartRef.current.data.labels.push(time.toFixed(1));
      efficiencyChartRef.current.data.datasets[0].data.push(efficiency);
      efficiencyChartRef.current.update('none');
    }
  }

  // Slider change handler
  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const idx = Number(e.target.value);
    setCurrentIndex(idx);
    updateDisplays(idx);
    // optionally rebuild chart snapshots up to idx (omitted for perf)
    updateProgress(idx);
  }

  // File drag & drop (optional)
  useEffect(() => {
    const onDrop = (ev: DragEvent) => {
      ev.preventDefault();
      const f = ev.dataTransfer?.files?.[0];
      if (f && f.name.endsWith('.csv')) parseFile(f);
    };
    const onOver = (ev: DragEvent) => ev.preventDefault();
    window.addEventListener('drop', onDrop);
    window.addEventListener('dragover', onOver);
    return () => {
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragover', onOver);
    };
  }, []);

  // Render
  return (
    <div className="visualizador">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-3 items-center">
          <input ref={fileInputRef} type="file" accept=".csv" />
          <button onClick={handleLoad} className="px-4 py-2 bg-blue-600 text-white rounded">Cargar</button>
          <span className="text-sm text-gray-600 ml-3">{fileInfo}</span>
        </div>
      </div>

      <div id="controls" className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-3 items-center">
          <button onClick={() => isPlaying ? pausePlayback() : startPlayback()} className="px-4 py-2 bg-green-600 text-white rounded">
            {isPlaying ? 'Pausar' : 'Play'}
          </button>
          <button onClick={resetPlayback} className="px-4 py-2 bg-gray-600 text-white rounded">Reset</button>

          <label className="ml-4">Velocidad:
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="ml-2">
              <option value={1}>1x</option>
              <option value={10}>10x</option>
              <option value={50}>50x</option>
              <option value={100}>100x</option>
              <option value={500}>500x</option>
            </select>
          </label>

          <input
          type="range"
          min={0}
          max={sliderMax}
          value={currentIndex}
          onChange={handleSliderChange}
          className="ml-4"
          style={{ width: 300 }}
        />
          <div id="progressText" className="ml-4 text-sm text-gray-600">{/* updated via updateProgress */}</div>
        </div>
      </div>

      <div id="currentValues" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-blue-500">
          <div className="text-xs text-gray-500">Tiempo</div>
          <div id="currentTime" className="text-xl font-bold text-blue-600">0.0 s</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-green-500">
          <div className="text-xs text-gray-500">Velocidad</div>
          <div id="currentSpeed" className="text-xl font-bold text-green-600">0.0 km/h</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-orange-500">
          <div className="text-xs text-gray-500">Fuel Rate</div>
          <div id="currentFuelRate" className="text-xl font-bold text-orange-600">0.0 L/h</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 border-l-4 border-red-500">
          <div className="text-xs text-gray-500">Distancia Δ</div>
          <div id="currentDistance" className="text-xl font-bold text-red-600">0.0 km</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-semibold mb-2">Fuel Rate</h4>
          <canvas ref={fuelRateCanvas} id="fuelRateChart"></canvas>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-semibold mb-2">Velocidad</h4>
          <canvas ref={speedCanvas} id="speedChart"></canvas>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-semibold mb-2">Combustible Δ</h4>
          <canvas ref={fuelAccumCanvas} id="fuelAccumulatedChart"></canvas>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-semibold mb-2">Distancia Δ</h4>
          <canvas ref={distanceCanvas} id="distanceChart"></canvas>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h4 className="text-sm font-semibold mb-2">Rendimiento Acumulado</h4>
        <canvas ref={efficiencyCanvas} id="efficiencyChart"></canvas>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h4 className="text-sm font-semibold mb-2">Comparación Sensor vs Calculado</h4>
        <canvas ref={fuelComparisonCanvas} id="fuelComparisonChart"></canvas>
      </div>
    </div>
  );
}
