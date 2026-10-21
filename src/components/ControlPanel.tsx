import React from 'react';
import { SimulatorParams } from '../types/ecg';
import { Sliders, ShieldCheck, Zap, Waves, AlertCircle } from 'lucide-react';

interface ControlPanelProps {
  params: SimulatorParams;
  onChangeParams: (updater: (prev: SimulatorParams) => SimulatorParams) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onChangeParams
}) => {
  const updateField = <K extends keyof SimulatorParams>(key: K, value: SimulatorParams[K]) => {
    onChangeParams((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl text-slate-200">
      <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Interactive Biophysical Controls
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Live Synthesis</span>
      </div>

      {/* Main Physiological Sliders */}
      <div className="space-y-3">
        {/* Heart Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Heart Rate (HR):</span>
            <span className="font-mono font-bold text-emerald-400">{params.heartRate} BPM</span>
          </div>
          <input
            type="range"
            min="30"
            max="260"
            step="1"
            value={params.heartRate}
            onChange={(e) => updateField('heartRate', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30 (Brady)</span>
            <span>60-100 (Normal)</span>
            <span>260 (Tachy)</span>
          </div>
        </div>

        {/* Electrical Axis Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">QRS Electrical Axis:</span>
            <span className="font-mono font-bold text-amber-400">{params.qrsAxisDeg}°</span>
          </div>
          <input
            type="range"
            min="-90"
            max="180"
            step="5"
            value={params.qrsAxisDeg}
            onChange={(e) => updateField('qrsAxisDeg', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-90° (LAD)</span>
            <span>+30° (Normal)</span>
            <span>+180° (RAD)</span>
          </div>
        </div>

        {/* PR Interval Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">PR Interval:</span>
            <span className="font-mono font-bold text-blue-400">
              {params.prIntervalMs > 0 ? `${params.prIntervalMs} ms` : 'N/A'}
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="400"
            step="5"
            value={params.prIntervalMs || 160}
            onChange={(e) => updateField('prIntervalMs', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-blue-500 cursor-pointer"
          />
        </div>

        {/* QRS Duration Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">QRS Duration:</span>
            <span className="font-mono font-bold text-purple-400">{params.qrsDurationMs} ms</span>
          </div>
          <input
            type="range"
            min="60"
            max="220"
            step="4"
            value={params.qrsDurationMs}
            onChange={(e) => updateField('qrsDurationMs', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Real-World Artifacts & Error Injectors */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Artifact & Noise Injectors</span>
          </div>
          <button
            onClick={() => updateField('filterActive', !params.filterActive)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
              params.filterActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Bandpass/Notch Filter (0.05 - 40 Hz)"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Filter: {params.filterActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Baseline Wander */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Respiratory Drift (Wander):</span>
            <span className="font-mono">{Math.round(params.baselineWander * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.baselineWander}
            onChange={(e) => updateField('baselineWander', Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded accent-slate-400 cursor-pointer"
          />
        </div>

        {/* 50Hz AC Powerline Interference */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>50Hz AC Mains Hum:</span>
            <span className="font-mono">{Math.round(params.acInterference50Hz * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.acInterference50Hz}
            onChange={(e) => updateField('acInterference50Hz', Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded accent-slate-400 cursor-pointer"
          />
        </div>

        {/* Muscle Tremor / Shivering */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>EMG Muscle Tremor (Shivering):</span>
            <span className="font-mono">{Math.round(params.muscleTremor * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.muscleTremor}
            onChange={(e) => updateField('muscleTremor', Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded accent-slate-400 cursor-pointer"
          />
        </div>

        {/* Lead Misplacement Selector */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-medium text-slate-300 block">
            Lead Placement / Technical Error:
          </label>
          <select
            value={params.leadReversal}
            onChange={(e) => updateField('leadReversal', e.target.value as SimulatorParams['leadReversal'])}
            className="w-full bg-slate-950 text-slate-200 text-xs py-1.5 px-2 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="none">Standard Diagnostic Placement (Normal)</option>
            <option value="LA-RA">LA ↔ RA Reversal (Negative Lead I, Pos aVR)</option>
            <option value="RA-LL">RA ↔ LL Reversal (Inverted Lead II)</option>
            <option value="V1-V2-high">V1/V2 Placed 1 Rib Too High (False Septal)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
