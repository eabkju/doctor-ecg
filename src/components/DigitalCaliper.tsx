import React, { useState } from 'react';
import { Scissors } from 'lucide-react';

interface DigitalCaliperProps {
  active: boolean;
  onToggle: () => void;
  sweepSpeedMmSec: number; // 25 or 50 mm/s
  gainMmPerMv: number; // 5, 10, or 20 mm/mV
  needleA: number; // 0 to 100 %
  needleB: number; // 0 to 100 %
  onChangeNeedles: (a: number, b: number) => void;
}

export const DigitalCaliper: React.FC<DigitalCaliperProps> = ({
  active,
  onToggle,
  sweepSpeedMmSec,
  needleA,
  needleB,
  onChangeNeedles
}) => {
  if (!active) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all"
        title="Activate Draggable Electronic Calipers"
      >
        <Scissors className="w-3.5 h-3.5 text-amber-400 rotate-90" />
        <span>Electronic Calipers</span>
      </button>
    );
  }

  // Calculate distance in physical screen mm approximation (standard 10s = 250mm across width)
  const distancePct = Math.abs(needleB - needleA);
  const estimatedSeconds = (distancePct / 100) * (250 / sweepSpeedMmSec);
  const deltaMs = Math.round(estimatedSeconds * 1000);
  const smallBoxes = (deltaMs / 40).toFixed(1);
  const largeBoxes = (deltaMs / 200).toFixed(1);
  const bpm = deltaMs > 0 ? Math.round(60000 / deltaMs) : 0;

  const handleMarchForward = () => {
    const diff = needleB - needleA;
    const newA = Math.min(100 - diff, needleB);
    const newB = Math.min(100, needleB + diff);
    onChangeNeedles(newA, newB);
  };

  const handleMarchBackward = () => {
    const diff = needleB - needleA;
    const newB = Math.max(diff, needleA);
    const newA = Math.max(0, needleA - diff);
    onChangeNeedles(newA, newB);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-xl text-xs gap-3">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 font-mono text-amber-300 font-bold bg-amber-900/50 px-2.5 py-1 rounded-lg border border-amber-500/30">
          <Scissors className="w-3.5 h-3.5 rotate-90 text-amber-400" />
          <span>Δt: {deltaMs} ms</span>
        </div>
        <div className="text-[11px] text-amber-200/80 font-mono space-x-2">
          <span>{smallBoxes} small boxes</span>
          <span>•</span>
          <span>{largeBoxes} large boxes</span>
          <span>•</span>
          <span className="font-bold text-amber-300">Rate: {bpm > 0 && bpm < 400 ? `${bpm} BPM` : '--'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {/* March controls */}
        <div className="flex items-center space-x-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-amber-500/30">
          <button
            onClick={handleMarchBackward}
            className="p-1 hover:text-amber-300 text-slate-300 transition-colors font-mono"
            title="March Caliper Left"
          >
            ← March
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={handleMarchForward}
            className="p-1 hover:text-amber-300 text-slate-300 transition-colors font-mono"
            title="March Caliper Right"
          >
            March →
          </button>
        </div>

        {/* Position sliders for touch/mobile */}
        <div className="flex items-center space-x-1.5">
          <input
            type="range"
            min="0"
            max="100"
            value={needleA}
            onChange={(e) => onChangeNeedles(Number(e.target.value), needleB)}
            className="w-16 h-1 accent-amber-400 cursor-pointer"
            title="Needle 1 Position"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={needleB}
            onChange={(e) => onChangeNeedles(needleA, Number(e.target.value))}
            className="w-16 h-1 accent-amber-400 cursor-pointer"
            title="Needle 2 Position"
          />
        </div>

        <button
          onClick={onToggle}
          className="text-xs text-amber-400/80 hover:text-amber-300 hover:underline px-1.5"
        >
          Close
        </button>
      </div>
    </div>
  );
};
