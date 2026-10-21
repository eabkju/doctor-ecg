import React from 'react';
import { Compass } from 'lucide-react';

interface HeartVisualizerProps {
  heartRate: number;
  qrsAxisDeg: number;
  rhythm: string;
}

export const HeartVisualizer: React.FC<HeartVisualizerProps> = ({
  heartRate,
  qrsAxisDeg,
  rhythm
}) => {
  // Cycle duration in seconds
  const cycleSec = 60 / Math.max(20, Math.min(300, heartRate));

  // Determine axis quadrant interpretation
  const getAxisInterpretation = (deg: number): { label: string; color: string } => {
    if (deg >= -30 && deg <= 90) return { label: 'Normal Cardiac Axis', color: 'text-emerald-400' };
    if (deg < -30 && deg >= -90) return { label: 'Left Axis Deviation (LAD)', color: 'text-amber-400' };
    if (deg > 90 && deg <= 180) return { label: 'Right Axis Deviation (RAD)', color: 'text-rose-400' };
    return { label: 'Extreme / Northwest Axis', color: 'text-purple-400' };
  };

  const axisInfo = getAxisInterpretation(qrsAxisDeg);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            3D Cardiac Conduction & Axis
          </h3>
        </div>
        <span className={`text-[11px] font-mono font-bold ${axisInfo.color}`}>
          {qrsAxisDeg}° ({axisInfo.label})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* Anatomical Conduction Diagram */}
        <div className="relative aspect-square max-w-[200px] mx-auto bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Heart Silhouette */}
            <path
              d="M100 175 C 20 120, 20 60, 60 40 C 85 25, 100 50, 100 50 C 100 50, 115 25, 140 40 C 180 60, 180 120, 100 175 Z"
              fill="#1e1b2e"
              stroke="#4338ca"
              strokeWidth="2"
            />
            {/* Septum */}
            <path d="M100 65 L100 155" stroke="#312e81" strokeWidth="4" strokeDasharray="3,3" />

            {/* SA Node */}
            <circle
              cx="68"
              cy="52"
              r="6"
              fill="#fbbf24"
              className="animate-ping"
              style={{ animationDuration: `${cycleSec}s` }}
            />
            <circle cx="68" cy="52" r="6" fill="#f59e0b" />
            <text x="44" y="44" fill="#fde68a" fontSize="8" fontFamily="monospace" fontWeight="bold">SA Node</text>

            {/* AV Node */}
            <circle
              cx="98"
              cy="85"
              r="5"
              fill="#10b981"
              className="animate-pulse"
              style={{ animationDuration: `${cycleSec}s` }}
            />
            <text x="108" y="88" fill="#a7f3d0" fontSize="8" fontFamily="monospace" fontWeight="bold">AV Node</text>

            {/* Bundle of His & Purkinje fibers */}
            <path
              d="M100 90 L100 115 M100 115 Q75 140 55 125 M100 115 Q125 140 145 125"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="40" y="145" fill="#67e8f9" fontSize="7" fontFamily="monospace">R. Bundle</text>
            <text x="125" y="145" fill="#67e8f9" fontSize="7" fontFamily="monospace">L. Bundle</text>
          </svg>

          <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
            Phase Sync: Live
          </div>
        </div>

        {/* Cabrera Hexaxial Frontal Axis Wheel */}
        <div className="relative aspect-square max-w-[200px] mx-auto bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col items-center justify-center">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            {/* Hexaxial circular dial */}
            <circle cx="80" cy="80" r="65" fill="none" stroke="#334155" strokeWidth="1" />
            <circle cx="80" cy="80" r="45" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />

            {/* Lead Axes: I (0°), II (+60°), III (+120°), aVR (-150°), aVL (-30°), aVF (+90°) */}
            {/* Lead I: 0 deg (horizontal right) */}
            <line x1="15" y1="80" x2="145" y2="80" stroke="#475569" strokeWidth="1" />
            <text x="146" y="83" fill="#94a3b8" fontSize="8" fontWeight="bold">I (0°)</text>

            {/* aVF: +90 deg (vertical down) */}
            <line x1="80" y1="15" x2="80" y2="145" stroke="#475569" strokeWidth="1" />
            <text x="70" y="155" fill="#94a3b8" fontSize="8" fontWeight="bold">aVF (+90°)</text>

            {/* Lead II: +60 deg */}
            <line x1="32" y1="45" x2="128" y2="115" stroke="#475569" strokeWidth="1" />
            <text x="126" y="128" fill="#94a3b8" fontSize="7">II (+60°)</text>

            {/* Lead III: +120 deg */}
            <line x1="128" y1="45" x2="32" y2="115" stroke="#475569" strokeWidth="1" />
            <text x="10" y="128" fill="#94a3b8" fontSize="7">III (+120°)</text>

            {/* aVL: -30 deg */}
            <text x="122" y="40" fill="#64748b" fontSize="7">aVL (-30°)</text>
            {/* aVR: -150 deg */}
            <text x="12" y="40" fill="#64748b" fontSize="7">aVR (-150°)</text>

            {/* Active Vector Arrow (rotated by qrsAxisDeg) */}
            {(() => {
              const rad = (qrsAxisDeg * Math.PI) / 180;
              const endX = 80 + 52 * Math.cos(rad);
              const endY = 80 + 52 * Math.sin(rad);
              return (
                <>
                  <line
                    x1="80"
                    y1="80"
                    x2={endX}
                    y2={endY}
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx={endX} cy={endY} r="4" fill="#ef4444" />
                </>
              );
            })()}
            <circle cx="80" cy="80" r="3" fill="#ffffff" />
          </svg>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Cabrera Hexaxial Wheel</div>
        </div>
      </div>
    </div>
  );
};
