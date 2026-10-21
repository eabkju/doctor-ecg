import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  SimulatorParams, 
  LeadName, 
  ECGTheme 
} from '../types/ecg';
import { 
  computeCardiacDipole, 
  projectTo12Leads 
} from '../core/mathEngine';
import { generateArtifacts } from '../core/noiseGenerator';
import { soundManager } from '../audio/audioEngine';
import { Sparkles } from 'lucide-react';

interface ECGMonitorProps {
  params: SimulatorParams;
  isPlaying: boolean;
  theme: ECGTheme;
  highlightTerritories: boolean;
  onToggleTerritories: () => void;
  caliperActive: boolean;
  caliperNeedles?: { needleA: number; needleB: number };
  onChangeNeedles?: (a: number, b: number) => void;
}

/** Number of discrete samples per cardiac cycle in the LUT (medical-grade resolution) */
const LUT_SIZE = 512;

/**
 * Pre-computes a full cardiac cycle lookup table for all 12 leads.
 * Called only when SimulatorParams change — NOT inside the rAF loop.
 * Reduces render-loop computation from ~6900 heavy calls/frame → fast table interpolation.
 */
function buildECGLookupTable(
  params: SimulatorParams,
  axisRad: number
): Record<LeadName, Float32Array> {
  const table: Partial<Record<LeadName, Float32Array>> = {};
  const leads: LeadName[] = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  for (const lead of leads) {
    table[lead] = new Float32Array(LUT_SIZE);
  }

  // Use a representative absolute time = 0 for the LUT; flutter/AF use currentTimeSec
  // for time-based oscillators — these are handled as special cases in the rAF loop.
  const isTimeDependent =
    params.rhythm.includes('atrial_flutter') ||
    params.rhythm.includes('av_block_3rd_degree');

  if (!isTimeDependent) {
    for (let i = 0; i < LUT_SIZE; i++) {
      const theta = (i / LUT_SIZE) * 2 * Math.PI - Math.PI;
      const dipole = computeCardiacDipole(theta, params, axisRad, 0);
      const projected = projectTo12Leads(dipole, params, theta);
      for (const lead of leads) {
        table[lead]![i] = projected[lead];
      }
    }
  }
  // For time-dependent rhythms, table remains zeroed and rAF loop will call live compute.

  return table as Record<LeadName, Float32Array>;
}

/** Fast linear interpolation into a pre-built LUT given a phase theta ∈ [-π, +π] */
function sampleLUT(lut: Float32Array, theta: number): number {
  const norm = (theta + Math.PI) / (2 * Math.PI); // 0 → 1
  const idx = norm * LUT_SIZE;
  const lo = Math.floor(idx) % LUT_SIZE;
  const hi = (lo + 1) % LUT_SIZE;
  const frac = idx - Math.floor(idx);
  return lut[lo] + frac * (lut[hi] - lut[lo]);
}

export const ECGMonitor: React.FC<ECGMonitorProps> = ({
  params,
  isPlaying,
  theme,
  highlightTerritories,
  onToggleTerritories,
  caliperActive,
  caliperNeedles,
  onChangeNeedles
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Calibration settings
  const [sweepSpeed, setSweepSpeed] = useState<25 | 50>(25); // mm/s
  const [gain, setGain] = useState<5 | 10 | 20>(10); // mm/mV
  const [viewLayout, setViewLayout] = useState<'standard12' | 'monitor'>('standard12');

  // Animation time tracking
  const timeRef = useRef<number>(0);
  const lastBeepTimeRef = useRef<number>(0);

  // ── Performance: cache canvas dimensions (updated only on resize via ResizeObserver) ──
  const cachedRectRef = useRef<{ width: number; height: number }>({ width: 800, height: 450 });

  // ── Performance: cache CSS theme colors (updated only when theme changes) ──
  const themeColorsRef = useRef({
    bgColor: '#FFFDF9',
    gridColor: '#F8B4B4',
    gridBoldColor: '#E05A5A',
    traceColor: '#1A1A1A',
    cursorColor: '#DC2626',
  });

  // ── Performance: pre-built ECG LUT — rebuilt only when params change ──
  const lutRef = useRef<Record<LeadName, Float32Array> | null>(null);
  const lutParamsKeyRef = useRef<string>('');

  // ── Flag: whether rhythm requires per-frame live computation (time-dependent oscillators) ──
  const isTimeDependentRef = useRef<boolean>(false);

  // 12-Lead standard layout arrangement: 3 rows x 4 columns + continuous Lead II rhythm strip
  const leadLayout: LeadName[][] = [
    ['I', 'aVR', 'V1', 'V4'],
    ['II', 'aVL', 'V2', 'V5'],
    ['III', 'aVF', 'V3', 'V6']
  ];

  // Territory color tags
  const getTerritoryColor = (lead: LeadName): string | null => {
    if (!highlightTerritories) return null;
    if (lead === 'V1' || lead === 'V2') return 'rgba(234, 179, 8, 0.18)';
    if (lead === 'V3' || lead === 'V4') return 'rgba(6, 182, 212, 0.18)';
    if (lead === 'I' || lead === 'aVL' || lead === 'V5' || lead === 'V6') return 'rgba(59, 130, 246, 0.18)';
    if (lead === 'II' || lead === 'III' || lead === 'aVF') return 'rgba(239, 68, 68, 0.18)';
    return null;
  };

  // ── Effect 1: Update theme color cache when theme prop changes ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Read CSS custom properties once per theme change (NOT inside rAF)
    const computedStyle = getComputedStyle(canvas);
    themeColorsRef.current = {
      bgColor:       computedStyle.getPropertyValue('--ecg-bg').trim()        || '#FFFDF9',
      gridColor:     computedStyle.getPropertyValue('--ecg-grid').trim()      || '#F8B4B4',
      gridBoldColor: computedStyle.getPropertyValue('--ecg-grid-bold').trim() || '#E05A5A',
      traceColor:    computedStyle.getPropertyValue('--ecg-trace').trim()     || '#1A1A1A',
      cursorColor:   computedStyle.getPropertyValue('--ecg-cursor').trim()    || '#DC2626',
    };
  }, [theme]);

  // ── Effect 2: Update canvas rect cache only on resize (NOT inside rAF) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        cachedRectRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
        // Re-read theme colors after resize (layout may have changed)
        const cs = getComputedStyle(canvas);
        themeColorsRef.current = {
          bgColor:       cs.getPropertyValue('--ecg-bg').trim()        || '#FFFDF9',
          gridColor:     cs.getPropertyValue('--ecg-grid').trim()      || '#F8B4B4',
          gridBoldColor: cs.getPropertyValue('--ecg-grid-bold').trim() || '#E05A5A',
          traceColor:    cs.getPropertyValue('--ecg-trace').trim()     || '#1A1A1A',
          cursorColor:   cs.getPropertyValue('--ecg-cursor').trim()    || '#DC2626',
        };
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Effect 3: Rebuild LUT when params change ──
  useEffect(() => {
    const axisRad = (params.qrsAxisDeg * Math.PI) / 180;
    const paramsKey = JSON.stringify({
      hr: params.heartRate, rhythm: params.rhythm, qrs: params.qrsDurationMs,
      axis: params.qrsAxisDeg, mods: params.leadModifiers, rev: params.leadReversal
    });

    if (paramsKey !== lutParamsKeyRef.current) {
      lutParamsKeyRef.current = paramsKey;
      isTimeDependentRef.current =
        params.rhythm.includes('atrial_flutter') ||
        params.rhythm.includes('av_block_3rd_degree');
      lutRef.current = buildECGLookupTable(params, axisRad);
    }
  }, [params]);

  // ── Effect 4: Main rAF render loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Ensure LUT is built for initial render
    const axisRadInit = (params.qrsAxisDeg * Math.PI) / 180;
    if (!lutRef.current) {
      isTimeDependentRef.current =
        params.rhythm.includes('atrial_flutter') ||
        params.rhythm.includes('av_block_3rd_degree');
      lutRef.current = buildECGLookupTable(params, axisRadInit);
    }

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      if (isPlaying) {
        timeRef.current += dt;
      }

      const currentTime = timeRef.current;

      // ── Use cached rect (no getBoundingClientRect per frame) ──
      const { width, height } = cachedRectRef.current;
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.floor(width * dpr);
      const targetH = Math.floor(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // ── Use cached theme colors (no getComputedStyle per frame) ──
      const { bgColor, gridColor, gridBoldColor, traceColor, cursorColor } = themeColorsRef.current;

      // Dynamic RR interval (AFib jitter)
      const isAFib = params.rhythm.includes('atrial_fibrillation');
      const baseRR = 60 / Math.max(20, Math.min(300, params.heartRate));
      const afibJitter = isAFib
        ? 0.28 * Math.sin(currentTime * 3.8) + 0.18 * Math.cos(currentTime * 8.4)
        : 0;
      const rrIntervalSec = Math.max(0.2, baseRR * (1 + afibJitter));

      // QRS beep trigger
      const currentCyclePhase = (currentTime % rrIntervalSec) / rrIntervalSec;
      if (currentCyclePhase < 0.12 && now - lastBeepTimeRef.current > rrIntervalSec * 750) {
        soundManager.playQRSBeep(98);
        lastBeepTimeRef.current = now;
      }

      // ── Cache axisRad for this frame ──
      const axisRad = (params.qrsAxisDeg * Math.PI) / 180;
      const isTimeDependent = isTimeDependentRef.current;
      const lut = lutRef.current!;

      // 1. Clear background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Medical Millimeter Grid
      const pxPerMm = Math.max(3.2, Math.min(4.8, width / 260));
      const smallBoxPx = pxPerMm;
      const largeBoxPx = pxPerMm * 5;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += smallBoxPx) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += smallBoxPx) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      ctx.lineWidth = 1.0;
      ctx.strokeStyle = gridBoldColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += largeBoxPx) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += largeBoxPx) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      // 3. Render leads
      const pxPerMv = pxPerMm * gain;

      /**
       * Inline helper: sample ECG voltage for a given lead at absolute time t.
       * Uses LUT for normal rhythms; falls back to live compute for time-dependent ones.
       */
      const sampleVoltage = (lead: LeadName, t: number, artifactChannel: number): number => {
        const phaseTheta = ((t % rrIntervalSec) / rrIntervalSec) * 2 * Math.PI - Math.PI;
        let raw: number;
        if (isTimeDependent) {
          const dipole = computeCardiacDipole(phaseTheta, params, axisRad, t);
          const allLeads = projectTo12Leads(dipole, params, phaseTheta);
          raw = allLeads[lead];
        } else {
          raw = sampleLUT(lut[lead], phaseTheta);
        }
        return raw + generateArtifacts(t, params, artifactChannel);
      };

      if (viewLayout === 'standard12') {
        const gridHeight = height * 0.74;
        const rowHeight = gridHeight / 3;
        const colWidth = width / 4;
        const rhythmHeight = height * 0.26;
        const rhythmY = gridHeight;

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const lead = leadLayout[r][c];
            const cellX = c * colWidth;
            const cellY = r * rowHeight;
            const baselineY = cellY + rowHeight / 2;

            // Territory highlight
            const territoryBg = getTerritoryColor(lead);
            if (territoryBg) {
              ctx.fillStyle = territoryBg;
              ctx.fillRect(cellX + 2, cellY + 2, colWidth - 4, rowHeight - 4);
            }

            // Lead label
            ctx.fillStyle = theme === 'icu' || theme === 'crt' || theme === 'blueprint' ? '#94A3B8' : '#475569';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillText(lead, cellX + 8, cellY + 16);

            // 1 mV Calibration Pulse
            const calStepWidthPx = (0.2 * sweepSpeed) * pxPerMm;
            const calStepHeightPx = 1.0 * pxPerMv;
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cellX + 6, baselineY);
            ctx.lineTo(cellX + 10, baselineY);
            ctx.lineTo(cellX + 10, baselineY - calStepHeightPx);
            ctx.lineTo(cellX + 10 + calStepWidthPx, baselineY - calStepHeightPx);
            ctx.lineTo(cellX + 10 + calStepWidthPx, baselineY);
            ctx.stroke();

            // Waveform trace
            ctx.beginPath();
            const startX = cellX + 14 + calStepWidthPx;
            const endX = cellX + colWidth - 4;
            const secondsInCell = (endX - startX) / (sweepSpeed * pxPerMm);
            const artifactCh = r * 4 + c;

            for (let px = startX; px <= endX; px += 1.5) {
              const relSec = ((px - startX) / (endX - startX)) * secondsInCell;
              const t = currentTime + relSec;
              const totalVoltage = sampleVoltage(lead, t, artifactCh);
              const waveY = baselineY - (totalVoltage * pxPerMv);
              if (px === startX) ctx.moveTo(px, waveY);
              else ctx.lineTo(px, waveY);
            }
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Cell boundary dividers
            ctx.strokeStyle = gridBoldColor;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cellX, cellY);
            ctx.lineTo(cellX + colWidth, cellY);
            ctx.lineTo(cellX + colWidth, cellY + rowHeight);
            ctx.stroke();
          }
        }

        // Continuous Lead II Rhythm Strip
        const rhythmBaselineY = rhythmY + rhythmHeight / 2;
        ctx.fillStyle = theme === 'icu' || theme === 'crt' || theme === 'blueprint' ? '#38BDF8' : '#0369A1';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText('RHYTHM STRIP (Lead II - Continuous 10s)', 8, rhythmY + 16);

        const calPulseWidth = (0.2 * sweepSpeed) * pxPerMm;
        const calPulseHeight = 1.0 * pxPerMv;
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(8, rhythmBaselineY);
        ctx.lineTo(14, rhythmBaselineY);
        ctx.lineTo(14, rhythmBaselineY - calPulseHeight);
        ctx.lineTo(14 + calPulseWidth, rhythmBaselineY - calPulseHeight);
        ctx.lineTo(14 + calPulseWidth, rhythmBaselineY);
        ctx.stroke();

        ctx.beginPath();
        const rStartX = 18 + calPulseWidth;
        const rEndX = width - 8;
        const rSeconds = (rEndX - rStartX) / (sweepSpeed * pxPerMm);

        for (let px = rStartX; px <= rEndX; px += 1.5) {
          const relSec = ((px - rStartX) / (rEndX - rStartX)) * rSeconds;
          const t = currentTime + relSec;
          const totalVoltage = sampleVoltage('II', t, 1);
          const waveY = rhythmBaselineY - (totalVoltage * pxPerMv);
          if (px === rStartX) ctx.moveTo(px, waveY);
          else ctx.lineTo(px, waveY);
        }
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 1.6;
        ctx.stroke();

      } else {
        // Real-Time ICU Monitor Sweeping Beam Mode
        const baselineY = height / 2;
        const sweepPeriod = 6.0;
        const sweepProgress = (currentTime % sweepPeriod) / sweepPeriod;
        const sweepCursorX = sweepProgress * width;

        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(sweepCursorX, 0);
        ctx.lineTo(sweepCursorX, height);
        ctx.stroke();

        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        for (let px = 0; px < width; px += 2) {
          const distAhead = (px - sweepCursorX + width) % width;
          if (distAhead > 0 && distAhead < 25) continue;

          const t = currentTime - ((sweepCursorX - px + width) % width) / (sweepSpeed * pxPerMm);
          const totalVoltage = sampleVoltage('II', t, 1);
          const waveY = baselineY - (totalVoltage * pxPerMv);

          if (px === 0) ctx.moveTo(px, waveY);
          else ctx.lineTo(px, waveY);
        }
        ctx.stroke();

        // Live Monitor Vitals Overlay
        ctx.fillStyle = '#00FF66';
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.fillText(`HR: ${params.heartRate}`, width - 140, 36);
        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(`SpO2: 98%`, width - 140, 62);
      }

      // 4. Digital Electronic Caliper Overlay
      if (caliperActive && caliperNeedles) {
        const xA = (caliperNeedles.needleA / 100) * width;
        const xB = (caliperNeedles.needleB / 100) * width;
        const leftX = Math.min(xA, xB);
        const rightX = Math.max(xA, xB);
        const distPx = rightX - leftX;
        const deltaSeconds = distPx / (sweepSpeed * pxPerMm);
        const deltaMs = Math.round(deltaSeconds * 1000);

        ctx.save();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(xA, 0); ctx.lineTo(xA, height);
        ctx.moveTo(xB, 0); ctx.lineTo(xB, height);
        ctx.stroke();
        ctx.setLineDash([]);

        [xA, xB].forEach((xPos) => {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(xPos, 14, 5, 0, 2 * Math.PI);
          ctx.arc(xPos, height - 14, 5, 0, 2 * Math.PI);
          ctx.fill();
        });

        const bridgeY = 26;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(leftX, bridgeY);
        ctx.lineTo(rightX, bridgeY);
        ctx.stroke();

        const midX = (leftX + rightX) / 2;
        const tagText = `Δt: ${deltaMs} ms`;
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const tagWidth = ctx.measureText(tagText).width;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.2;
        ctx.fillRect(midX - tagWidth / 2 - 8, 16, tagWidth + 16, 20);
        ctx.strokeRect(midX - tagWidth / 2 - 8, 16, tagWidth + 16, 20);
        ctx.fillStyle = '#FCD34D';
        ctx.fillText(tagText, midX - tagWidth / 2, 30);
        ctx.restore();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [params, isPlaying, theme, sweepSpeed, gain, viewLayout, highlightTerritories, caliperActive, caliperNeedles]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Top Controls Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2">
          {/* Layout Mode */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setViewLayout('standard12')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewLayout === 'standard12' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              12-Lead Paper (3x4+1)
            </button>
            <button
              onClick={() => setViewLayout('monitor')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewLayout === 'monitor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ICU Sweep Monitor
            </button>
          </div>

          {/* Sweep Speed (25 vs 50 mm/s) */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Speed:</span>
            <button
              onClick={() => setSweepSpeed(25)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                sweepSpeed === 25 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
              }`}
            >
              25 mm/s
            </button>
            <button
              onClick={() => setSweepSpeed(50)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                sweepSpeed === 50 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
              }`}
            >
              50 mm/s
            </button>
          </div>

          {/* Voltage Gain (5, 10, 20 mm/mV) */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Gain:</span>
            {[5, 10, 20].map((g) => (
              <button
                key={g}
                onClick={() => setGain(g as 5 | 10 | 20)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                  gain === g ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                {g}mm
              </button>
            ))}
          </div>
        </div>

        {/* Territory Coloring Toggle & Live Caliper */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTerritories}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              highlightTerritories
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Color-code Leads by Coronary Arteries"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Coronary Territories</span>
            <span className="md:hidden">Walls</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Monitor Surface */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[580px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Territory Legend floating tag when active */}
        {highlightTerritories && viewLayout === 'standard12' && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 bg-slate-950/85 backdrop-blur-sm p-1.5 rounded-lg border border-slate-800 text-[10px] font-mono z-10">
            <span className="flex items-center space-x-1 text-yellow-400">
              <span className="w-2.5 h-2.5 rounded bg-yellow-400/40 border border-yellow-400" />
              <span>Septal (LAD)</span>
            </span>
            <span className="flex items-center space-x-1 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded bg-cyan-400/40 border border-cyan-400" />
              <span>Anterior (LAD)</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-400">
              <span className="w-2.5 h-2.5 rounded bg-blue-400/40 border border-blue-400" />
              <span>Lateral (LCx)</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-400/40 border border-rose-400" />
              <span>Inferior (RCA)</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
