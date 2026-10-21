import React, { useRef, useEffect, useState } from 'react';
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
import { Maximize2, ShieldCheck, Heart, Sparkles, Sliders } from 'lucide-react';

interface ECGMonitorProps {
  params: SimulatorParams;
  isPlaying: boolean;
  theme: ECGTheme;
  highlightTerritories: boolean;
  onToggleTerritories: () => void;
  caliperActive: boolean;
}

export const ECGMonitor: React.FC<ECGMonitorProps> = ({
  params,
  isPlaying,
  theme,
  highlightTerritories,
  onToggleTerritories,
  caliperActive
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

  // 12-Lead standard layout arrangement: 3 rows x 4 columns + continuous Lead II rhythm strip
  const leadLayout: LeadName[][] = [
    ['I', 'aVR', 'V1', 'V4'],
    ['II', 'aVL', 'V2', 'V5'],
    ['III', 'aVF', 'V3', 'V6']
  ];

  // Territory color tags
  const getTerritoryColor = (lead: LeadName): string | null => {
    if (!highlightTerritories) return null;
    if (lead === 'V1' || lead === 'V2') return 'rgba(234, 179, 8, 0.18)'; // Septal - Proximal LAD (Yellow)
    if (lead === 'V3' || lead === 'V4') return 'rgba(6, 182, 212, 0.18)';  // Anterior - LAD (Cyan)
    if (lead === 'I' || lead === 'aVL' || lead === 'V5' || lead === 'V6') return 'rgba(59, 130, 246, 0.18)'; // Lateral - LCx (Blue)
    if (lead === 'II' || lead === 'III' || lead === 'aVF') return 'rgba(239, 68, 68, 0.18)'; // Inferior - RCA (Red)
    return null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05); // cap dt
      lastTimestamp = now;

      if (isPlaying) {
        timeRef.current += dt;
      }

      const currentTime = timeRef.current;

      // Handle monitor QRS sound triggering
      const rrIntervalSec = 60 / Math.max(20, Math.min(300, params.heartRate));
      const currentCyclePhase = (currentTime % rrIntervalSec) / rrIntervalSec; // 0 to 1
      if (
        currentCyclePhase < 0.12 && 
        now - lastBeepTimeRef.current > (rrIntervalSec * 750)
      ) {
        soundManager.playQRSBeep(98);
        lastBeepTimeRef.current = now;
      }

      // Resize canvas with pixel ratio
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Extract CSS Theme colors
      const computedStyle = getComputedStyle(canvas);
      const bgColor = computedStyle.getPropertyValue('--ecg-bg').trim() || '#FFFDF9';
      const gridColor = computedStyle.getPropertyValue('--ecg-grid').trim() || '#F8B4B4';
      const gridBoldColor = computedStyle.getPropertyValue('--ecg-grid-bold').trim() || '#E05A5A';
      const traceColor = computedStyle.getPropertyValue('--ecg-trace').trim() || '#1A1A1A';
      const cursorColor = computedStyle.getPropertyValue('--ecg-cursor').trim() || '#DC2626';

      // 1. Clear background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Medical Millimeter Grid
      // At standard 100 DPI on screens: ~3.78 px per mm.
      // Small box = 1 mm ~ 4 px; Large box = 5 mm ~ 20 px
      const pxPerMm = Math.max(3.2, Math.min(4.8, width / 260));
      const smallBoxPx = pxPerMm;
      const largeBoxPx = pxPerMm * 5;

      // Small grid lines (1mm)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += smallBoxPx) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += smallBoxPx) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Bold grid lines (5mm)
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = gridBoldColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += largeBoxPx) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += largeBoxPx) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Render 12-Leads
      const axisRad = (params.qrsAxisDeg * Math.PI) / 180;
      const pxPerMv = pxPerMm * gain; // 10 mm/mV -> ~40 px/mV

      if (viewLayout === 'standard12') {
        // Layout: 3 rows for standard 12 leads (75% height) + 1 bottom row for continuous Lead II (25% height)
        const gridHeight = height * 0.74;
        const rowHeight = gridHeight / 3;
        const colWidth = width / 4;
        const rhythmHeight = height * 0.26;
        const rhythmY = gridHeight;

        // Render 12 Leads (3 x 4)
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const lead = leadLayout[r][c];
            const cellX = c * colWidth;
            const cellY = r * rowHeight;
            const baselineY = cellY + rowHeight / 2;

            // Territory highlight if enabled
            const territoryBg = getTerritoryColor(lead);
            if (territoryBg) {
              ctx.fillStyle = territoryBg;
              ctx.fillRect(cellX + 2, cellY + 2, colWidth - 4, rowHeight - 4);
            }

            // Lead Label & Caliper mark
            ctx.fillStyle = theme === 'icu' || theme === 'crt' || theme === 'blueprint' ? '#94A3B8' : '#475569';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillText(lead, cellX + 8, cellY + 16);

            // Draw Standard 1 mV Calibration Pulse at the beginning of each lead
            const calStepWidthPx = (0.2 * sweepSpeed) * pxPerMm; // 200ms width
            const calStepHeightPx = 1.0 * pxPerMv; // 1mV height
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cellX + 6, baselineY);
            ctx.lineTo(cellX + 10, baselineY);
            ctx.lineTo(cellX + 10, baselineY - calStepHeightPx);
            ctx.lineTo(cellX + 10 + calStepWidthPx, baselineY - calStepHeightPx);
            ctx.lineTo(cellX + 10 + calStepWidthPx, baselineY);
            ctx.stroke();

            // Trace waveform across cell width
            ctx.beginPath();
            const startX = cellX + 14 + calStepWidthPx;
            const endX = cellX + colWidth - 4;
            const secondsInCell = (endX - startX) / (sweepSpeed * pxPerMm);

            for (let px = startX; px <= endX; px += 1.5) {
              const relSec = ((px - startX) / (endX - startX)) * secondsInCell;
              // Sample at static / scrolling position
              const t = (currentTime + relSec);
              const phaseTheta = ((t % rrIntervalSec) / rrIntervalSec) * 2 * Math.PI - Math.PI;

              const dipole = computeCardiacDipole(phaseTheta, params, axisRad);
              const leads = projectTo12Leads(dipole, params, phaseTheta);
              const rawVoltage = leads[lead] || 0;
              const artifact = generateArtifacts(t, params, r * 4 + c);
              const totalVoltage = rawVoltage + artifact;

              const waveY = baselineY - (totalVoltage * pxPerMv);

              if (px === startX) {
                ctx.moveTo(px, waveY);
              } else {
                ctx.lineTo(px, waveY);
              }
            }
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

        // Render Continuous Lead II Rhythm Strip at bottom
        const rhythmBaselineY = rhythmY + rhythmHeight / 2;
        ctx.fillStyle = theme === 'icu' || theme === 'crt' || theme === 'blueprint' ? '#38BDF8' : '#0369A1';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText('RHYTHM STRIP (Lead II - Continuous 10s)', 8, rhythmY + 16);

        // Calibration pulse for Rhythm Strip
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
          const phaseTheta = ((t % rrIntervalSec) / rrIntervalSec) * 2 * Math.PI - Math.PI;

          const dipole = computeCardiacDipole(phaseTheta, params, axisRad);
          const leads = projectTo12Leads(dipole, params, phaseTheta);
          const rawVoltage = leads['II'] || 0;
          const artifact = generateArtifacts(t, params, 1);
          const totalVoltage = rawVoltage + artifact;

          const waveY = rhythmBaselineY - (totalVoltage * pxPerMv);

          if (px === rStartX) {
            ctx.moveTo(px, waveY);
          } else {
            ctx.lineTo(px, waveY);
          }
        }
        ctx.stroke();

      } else {
        // Real-Time ICU Monitor Sweeping Beam Mode
        const baselineY = height / 2;
        const sweepPeriod = 6.0; // 6 seconds sweep cycle across screen
        const sweepProgress = (currentTime % sweepPeriod) / sweepPeriod;
        const sweepCursorX = sweepProgress * width;

        // Draw sweeping cursor bar
        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(sweepCursorX, 0);
        ctx.lineTo(sweepCursorX, height);
        ctx.stroke();

        // Waveform trace
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        for (let px = 0; px < width; px += 2) {
          // Erase margin 20px ahead of the sweep bar
          const distAhead = (px - sweepCursorX + width) % width;
          if (distAhead > 0 && distAhead < 25) {
            continue;
          }

          const t = currentTime - ((sweepCursorX - px + width) % width) / (sweepSpeed * pxPerMm);
          const phaseTheta = ((t % rrIntervalSec) / rrIntervalSec) * 2 * Math.PI - Math.PI;

          const dipole = computeCardiacDipole(phaseTheta, params, axisRad);
          const leads = projectTo12Leads(dipole, params, phaseTheta);
          const rawVoltage = leads['II'] || 0;
          const artifact = generateArtifacts(t, params, 1);
          const waveY = baselineY - ((rawVoltage + artifact) * pxPerMv);

          if (px === 0) {
            ctx.moveTo(px, waveY);
          } else {
            ctx.lineTo(px, waveY);
          }
        }
        ctx.stroke();

        // Live Monitor Vitals Overlay (Top Right)
        ctx.fillStyle = '#00FF66';
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.fillText(`HR: ${params.heartRate}`, width - 140, 36);
        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(`SpO2: 98%`, width - 140, 62);
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [params, isPlaying, theme, sweepSpeed, gain, viewLayout, highlightTerritories]);

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
