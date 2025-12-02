// Script mejorado: carga CSV, reproducción con control de velocidad, slider, gráficos SVG y comparación
// Archivo: [`version_estatica_html/script.js`](version_estatica_html/script.js:1)

(() => {
  // DOM shortcuts
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // --- Controles UI añadidos dinámicamente ---
  // Agrego en la pestaña "Escenario Real" o arriba para carga CSV y controles globales.
  const topBar = document.createElement('div');
  topBar.className = 'top-controls';
  topBar.innerHTML = `
    <div class="file-controls">
      <input id="csvFile" type="file" accept=".csv" />
      <button id="loadCsvBtn">Cargar CSV</button>
      <span id="fileInfo" class="file-info"></span>
    </div>
    <div class="playback-controls">
      <label>Velocidad: <select id="speedSelect">
        <option value="1">1x</option>
        <option value="10" selected>10x</option>
        <option value="50">50x</option>
        <option value="100">100x</option>
        <option value="500">500x</option>
      </select></label>
      <label>Index: <input id="timeSlider" type="range" min="0" max="0" value="0" style="width:220px"/></label>
      <button id="playCsvBtn">Play</button>
      <button id="pauseCsvBtn" style="display:none">Pause</button>
      <button id="resetCsvBtn">Reset</button>
      <span id="progressText" class="progress-text"></span>
    </div>
  `;
  // Insert topBar under header
  const header = qs('.site-header') || document.querySelector('header');
  if (header) header.parentNode.insertBefore(topBar, header.nextSibling);

  // --- State ---
  let csvData = [];
  let csvIndex = 0;
  let csvPlaying = false;
  let csvInterval = null;
  let csvAvgDt = 1.0; // seconds, estimated
  const maxPointsInChart = 200;

  // --- Helpers ---
  function parseCSVText(text) {
    // Simple CSV parser (handles quoted commas). Returns array of objects using header row.
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length === 0) return [];
    // parse header
    const header = parseCSVLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = parseCSVLine(lines[i]);
      if (vals.length === 0) continue;
      const obj = {};
      for (let j = 0; j < header.length; j++) {
        const key = header[j];
        let v = vals[j] !== undefined ? vals[j] : '';
        // try to coerce to number
        const n = Number(v.replace(/,/g, ''));
        obj[key] = isNaN(n) ? v : n;
      }
      rows.push(obj);
    }
    return rows;
  }

  function parseCSVLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' ) {
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.trim());
  }

  // --- UI elements references ---
  const csvFileEl = qs('#csvFile');
  const loadCsvBtn = qs('#loadCsvBtn');
  const fileInfoEl = qs('#fileInfo');
  const speedSelect = qs('#speedSelect');
  const timeSlider = qs('#timeSlider');
  const playCsvBtn = qs('#playCsvBtn');
  const pauseCsvBtn = qs('#pauseCsvBtn');
  const resetCsvBtn = qs('#resetCsvBtn');
  const progressText = qs('#progressText');

  // Display elements in app tabs (reuse IDs defined in index_full.html)
  const simTimeEl = qs('#sim-time');
  const simSpeedEl = qs('#sim-speed');
  const simOdoEl = qs('#sim-odo');
  const simChart = qs('#sim-chart');
  const simTheory = qs('#sim-theory');
  const simRects = qs('#sim-rects');
  const simPoint = qs('#sim-point');
  const simCode = qs('#sim-code');

  const fuelTimeEl = qs('#fuel-time');
  const fuelRateEl = qs('#fuel-rate');
  const fuelLitersEl = qs('#fuel-liters');
  const fuelChart = qs('#fuel-chart');
  const fuelTheory = qs('#fuel-theory');
  const fuelRects = qs('#fuel-rects');
  const fuelPoint = qs('#fuel-point');

  const totalDistEl = qs('#total-dist');
  const totalFuelEl = qs('#total-liters');
  const perfResultEl = qs('#perf-result');

  // --- Draw static theory curves on the two SVGs (based on the same functions) ---
  function drawTheoryCurvesSVG() {
    const maxT = 10;
    // sim
    const sScaleX = 500 / maxT;
    const sScaleY = 200 / 50;
    let d = '';
    for (let t = 0; t <= maxT; t += 0.1) {
      const v = velocidadKmH(t);
      const x = 50 + t * sScaleX;
      const y = 250 - v * sScaleY;
      d += (t === 0 ? 'M ' : ' L ') + x + ' ' + y;
    }
    if (simTheory) simTheory.setAttribute('d', d);

    // fuel
    const fScaleX = 500 / maxT;
    const fScaleY = 200 / 20;
    let df = '';
    for (let t = 0; t <= maxT; t += 0.1) {
      const fr = fuelRateLPorH(t);
      const x = 50 + t * fScaleX;
      const y = 250 - fr * fScaleY;
      df += (t === 0 ? 'M ' : ' L ') + x + ' ' + y;
    }
    if (fuelTheory) fuelTheory.setAttribute('d', df);
  }

  drawTheoryCurvesSVG();

  // --- CSV load handler ---
  loadCsvBtn.addEventListener('click', () => {
    const f = csvFileEl.files[0];
    if (!f) {
      alert('Selecciona un archivo CSV primero');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      csvData = parseCSVText(text);
      if (csvData.length === 0) {
        alert('CSV vacío o con formato no esperado');
        return;
      }
      // precompute average dt from Time column
      let totalDt = 0;
      let count = 0;
      for (let i = 1; i < Math.min(200, csvData.length); i++) {
        const dt_i = csvData[i].Time - csvData[i-1].Time;
        if (!isNaN(dt_i) && dt_i > 0) { totalDt += dt_i; count++; }
      }
      csvAvgDt = count > 0 ? totalDt / count : 1.0;
      // Setup slider
      timeSlider.max = Math.max(0, csvData.length - 1);
      timeSlider.value = 0;
      csvIndex = 0;
      fileInfoEl.textContent = `${f.name} — ${csvData.length} registros`;
      updateCsvDisplays(0);
      updateCsvChartsUpTo(0);
      progressText.textContent = `0.0 s / ${csvData[csvData.length-1].Time.toFixed(1)} s (0%)`;
    };
    reader.readAsText(f);
  });

  // Slider jump
  timeSlider.addEventListener('input', (ev) => {
    const idx = Number(ev.target.value);
    csvIndex = idx;
    updateCsvDisplays(idx);
    updateCsvChartsUpTo(idx);
    updateProgressText(idx);
  });

  // Play/Pause CSV playback
  playCsvBtn.addEventListener('click', () => startCsvPlayback());
  pauseCsvBtn.addEventListener('click', () => stopCsvPlayback());
  resetCsvBtn.addEventListener('click', () => resetCsvPlayback());

  function startCsvPlayback() {
    if (!csvData.length) return alert('Carga un CSV primero');
    if (csvPlaying) return;
    csvPlaying = true;
    playCsvBtn.style.display = 'none';
    pauseCsvBtn.style.display = '';
    const speed = Number(speedSelect.value) || 1;
    const intervalMs = (csvAvgDt * 1000) / speed;
    csvInterval = setInterval(() => {
      if (csvIndex >= csvData.length - 1) {
        stopCsvPlayback();
        return;
      }
      csvIndex++;
      updateCsvDisplays(csvIndex);
      updateCsvChartsIncremental(csvIndex);
      updateProgressText(csvIndex);
    }, Math.max(10, Math.round(intervalMs)));
  }

  function stopCsvPlayback() {
    csvPlaying = false;
    playCsvBtn.style.display = '';
    pauseCsvBtn.style.display = 'none';
    if (csvInterval) {
      clearInterval(csvInterval);
      csvInterval = null;
    }
  }

  function resetCsvPlayback() {
    stopCsvPlayback();
    csvIndex = 0;
    timeSlider.value = 0;
    if (csvData.length) {
      updateCsvDisplays(0);
      updateCsvChartsUpTo(0);
      updateProgressText(0);
    }
  }

  function updateProgressText(idx) {
    if (!csvData.length) return;
    const current = csvData[idx].Time;
    const total = csvData[csvData.length - 1].Time;
    const percent = (idx / (csvData.length - 1)) * 100;
    progressText.textContent = `${current.toFixed(1)} s / ${total.toFixed(1)} s (${percent.toFixed(1)}%)`;
  }

  // --- CSV-based display and chart functions ---
  function updateCsvDisplays(idx) {
    const row = csvData[idx];
    if (!row) return;
    // Map fields (based on Recorrido_1.txt)
    const timeVal = Number(row.Time || 0);
    const speed = Number(row['Wheel-Based Vehicle Speed (kph)'] || 0);
    const odoMeters = Number(row['High Resolution Total Vehicle Distance (m)'] || 0);
    const sensorFuel = Number(row['Engine Total Fuel Used (l)'] || 0);
    const calcFuel = Number(row['Combustible Calculado (l)'] || 0);
    // Show in main sim tab (approximate)
    if (simTimeEl) simTimeEl.textContent = `${timeVal.toFixed(1)} s`;
    if (simSpeedEl) simSpeedEl.textContent = `${speed.toFixed(1)} km/h`;
    if (simOdoEl) simOdoEl.textContent = `${(odoMeters/1000).toFixed(4)} km`;
    // fuel
    if (fuelTimeEl) fuelTimeEl.textContent = `${timeVal.toFixed(1)} s`;
    if (fuelRateEl) fuelRateEl.textContent = `${Number(row['Engine Fuel Rate (l/h)']||0).toFixed(2)} L/h`;
    if (fuelLitersEl) fuelLitersEl.textContent = `${(calcFuel - (csvData[0]['Combustible Calculado (l)']||0)).toFixed(6)} L`;
    // performance placeholders
    if (totalDistEl) totalDistEl.textContent = `${((odoMeters - (csvData[0]['High Resolution Total Vehicle Distance (m)']||0))/1000).toFixed(4)} km`;
    if (totalFuelEl) totalFuelEl.textContent = `${((calcFuel - (csvData[0]['Combustible Calculado (l)']||0))).toFixed(6)} L`;
    const deltaFuel = calcFuel - (csvData[0]['Combustible Calculado (l)']||0);
    const deltaDist = (odoMeters - (csvData[0]['High Resolution Total Vehicle Distance (m)']||0))/1000;
    const perf = deltaFuel > 0 ? (deltaDist / deltaFuel) : 0;
    if (perfResultEl) perfResultEl.textContent = `${perf.toFixed(2)} km/L`;
    // update slider
    if (!timeSlider.matches(':active')) timeSlider.value = idx;
  }

  // Build sampled charts up to index (fast refresh)
  function updateCsvChartsUpTo(targetIdx) {
    // build speed path and fuel path, sample to maxPointsInChart
    if (!csvData.length) return;
    const keepEveryN = Math.max(1, Math.floor(csvData.length / maxPointsInChart));
    // speed
    let speedPath = '';
    const sScaleX = 500 / csvData[csvData.length-1].Time;
    const sScaleY = 200 / 50;
    for (let i = 0; i <= targetIdx; i += keepEveryN) {
      const row = csvData[i];
      const t = Number(row.Time || 0);
      const v = Number(row['Wheel-Based Vehicle Speed (kph)'] || 0);
      const x = 50 + t * sScaleX;
      const y = 250 - v * sScaleY;
      speedPath += (i===0 ? 'M ' : ' L ') + x + ' ' + y;
    }
    if (simTheory) {
      // overlay theoretical curve already drawn; draw a sampled actual curve by setting sim-theory stroke to dashed? We reuse sim-theory for the theoretical curve.
      // For visibility, create or update an 'actual' path
      let actual = document.getElementById('sim-actual');
      if (!actual) {
        actual = document.createElementNS('http://www.w3.org/2000/svg','path');
        actual.setAttribute('id','sim-actual');
        actual.setAttribute('stroke','#0ea5e9');
        actual.setAttribute('stroke-width','2');
        actual.setAttribute('fill','none');
        simChart.appendChild(actual);
      }
      actual.setAttribute('d', speedPath);
    }
    // fuel
    let fuelPath = '';
    const fScaleX = 500 / csvData[csvData.length-1].Time;
    const fScaleY = 200 / 20;
    for (let i = 0; i <= targetIdx; i += keepEveryN) {
      const row = csvData[i];
      const t = Number(row.Time || 0);
      const fr = Number(row['Engine Fuel Rate (l/h)'] || 0);
      const x = 50 + t * fScaleX;
      const y = 250 - fr * fScaleY;
      fuelPath += (i===0 ? 'M ' : ' L ') + x + ' ' + y;
    }
    if (fuelTheory) {
      let actualF = document.getElementById('fuel-actual');
      if (!actualF) {
        actualF = document.createElementNS('http://www.w3.org/2000/svg','path');
        actualF.setAttribute('id','fuel-actual');
        actualF.setAttribute('stroke','#f97316');
        actualF.setAttribute('stroke-width','2');
        actualF.setAttribute('fill','none');
        fuelChart.appendChild(actualF);
      }
      actualF.setAttribute('d', fuelPath);
    }
  }

  // Incremental update on playback: draw rect for the new index
  function updateCsvChartsIncremental(idx) {
    // draw a small rect or update point positions
    const row = csvData[idx];
    if (!row) return;
    const t = Number(row.Time || 0);
    const v = Number(row['Wheel-Based Vehicle Speed (kph)'] || 0);
    const odoMeters = Number(row['High Resolution Total Vehicle Distance (m)'] || 0);
    // update sim point
    const sScaleX = 500 / csvData[csvData.length-1].Time;
    const sScaleY = 200 / 50;
    const px = 50 + t * sScaleX;
    const py = 250 - v * sScaleY;
    if (simPoint) { simPoint.setAttribute('cx', px); simPoint.setAttribute('cy', py); }

    // fuel point
    const fr = Number(row['Engine Fuel Rate (l/h)'] || 0);
    const fScaleX = 500 / csvData[csvData.length-1].Time;
    const fScaleY = 200 / 20;
    const fpx = 50 + t * fScaleX;
    const fpy = 250 - fr * fScaleY;
    if (fuelPoint) { fuelPoint.setAttribute('cx', fpx); fuelPoint.setAttribute('cy', fpy); }

    // optionally draw rectangles representing v * dt (from CSV dt approximated)
    // compute dt between this and previous
    if (idx > 0) {
      const prevT = Number(csvData[idx-1].Time || 0);
      const dt = t - prevT;
      // rect height and width
      const x = 50 + prevT * sScaleX;
      const width = Math.max(1, dt * sScaleX);
      const height = v * sScaleY;
      const y = 250 - height;
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', width);
      rect.setAttribute('height', height);
      rect.setAttribute('fill','rgba(59,130,246,0.2)');
      rect.setAttribute('stroke','rgba(59,130,246,0.4)');
      simRects.appendChild(rect);
      // limit number of rects
      while (simRects.children.length > 300) simRects.removeChild(simRects.firstChild);
    }
  }

  // --- CSV playback summary helpers already implemented above ---

  // --- File drag & drop (bonus) ---
  document.body.addEventListener('dragover', e => e.preventDefault());
  document.body.addEventListener('drop', e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.csv')) {
      csvFileEl.files = e.dataTransfer.files;
      fileInfoEl.textContent = `Archivo arrastrado: ${f.name}`;
    }
  });

  // --- Utility: expose parse function for console testing ---
  window.__integration_tools = {
    parseCSVText,
    csvData
  };

  // --- Fin del módulo ---
})();