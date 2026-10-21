import React from 'react';
import { 
  ECGCase, 
  LanguageMode 
} from '../types/ecg';
import { calculateQTc } from '../core/mathEngine';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DiagnosticPanelProps {
  activeCase: ECGCase;
  langMode: LanguageMode;
  onSelectCase?: (caseId: string) => void;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  activeCase,
  langMode
}) => {
  const { title, diagnosticSteps, realWorldClinicalPearl, urgency, territory, culpritArtery, simulatorParams } = activeCase;
  
  // Real-time QTc calculations
  const qtc = calculateQTc(simulatorParams.qtIntervalMs || 400, simulatorParams.heartRate);

  const getUrgencyBadge = (u: ECGCase['urgency']) => {
    switch (u) {
      case 'Cath Lab Activation (Code STEMI)':
      case 'Immediate Defibrillation/Resuscitation':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'Urgent Review':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl text-slate-200">
      {/* Title & Diagnostic Classification */}
      <div className="border-b border-slate-800 pb-3 flex flex-col space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(urgency)}`}>
            {urgency}
          </span>
          {territory && (
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
              Territory: {territory} {culpritArtery && culpritArtery !== 'N/A' ? `(${culpritArtery})` : ''}
            </span>
          )}
        </div>

        <div>
          {langMode !== 'bn' && (
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              {title.en}
            </h2>
          )}
          {langMode !== 'en' && (
            <h2 className="text-sm sm:text-base font-semibold text-rose-300 font-bengali leading-snug mt-0.5">
              {title.bn}
            </h2>
          )}
        </div>

        {/* Quick Calculated Intervals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">Heart Rate:</span>
            <span className="font-bold text-white text-sm">{simulatorParams.heartRate} BPM</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">PR Interval:</span>
            <span className={`font-bold text-sm ${simulatorParams.prIntervalMs > 200 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {simulatorParams.prIntervalMs > 0 ? `${simulatorParams.prIntervalMs} ms` : 'N/A'}
            </span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">QRS Duration:</span>
            <span className={`font-bold text-sm ${simulatorParams.qrsDurationMs > 120 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simulatorParams.qrsDurationMs} ms
            </span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">QTc (Bazett / Frid):</span>
            <span className="font-bold text-cyan-400 text-sm">
              {qtc.bazett > 0 ? `${qtc.bazett} / ${qtc.fridericia} ms` : 'Unmeasurable'}
            </span>
          </div>
        </div>
      </div>

      {/* Systematic 9-Step Clinical Checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Systematic 9-Step Reading Framework</span>
        </div>

        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {diagnosticSteps.map((step) => (
            <div
              key={step.step}
              className={`p-2.5 rounded-xl border text-xs transition-colors ${
                step.status === 'critical'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                  : step.status === 'abnormal'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[11px] flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                    {step.step}
                  </span>
                  <span className="text-slate-200">{step.param}</span>
                </span>
                {step.status === 'critical' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                ) : step.status === 'abnormal' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              {/* Explanations according to Language Mode */}
              {langMode === 'split' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 pt-1 border-t border-slate-800/60">
                  <div className="text-[11px] text-slate-200 leading-relaxed">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">EN:</span>
                    {step.en}
                  </div>
                  <div className="text-[11px] text-slate-300 font-bengali leading-relaxed border-t sm:border-t-0 sm:border-l border-slate-800/60 sm:pl-2">
                    <span className="text-[9px] uppercase font-bold text-rose-400 block mb-0.5">বাংলা:</span>
                    {step.bn}
                  </div>
                </div>
              ) : langMode === 'bn' ? (
                <p className="text-[11px] text-slate-200 font-bengali leading-relaxed">
                  {step.bn}
                </p>
              ) : (
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {step.en}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Bedside Clinical Pearl */}
      <div className="bg-gradient-to-r from-red-950/50 via-slate-900 to-amber-950/50 border border-red-500/30 rounded-xl p-3 text-xs">
        <div className="flex items-center space-x-1.5 text-red-400 font-bold mb-1.5">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Real-World Ward Scenario & Bedside Pearl</span>
        </div>

        {langMode === 'split' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1 pt-1 border-t border-slate-800">
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {realWorldClinicalPearl.en}
            </p>
            <p className="text-[11px] text-rose-200/90 font-bengali leading-relaxed border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-2.5">
              {realWorldClinicalPearl.bn}
            </p>
          </div>
        ) : langMode === 'bn' ? (
          <p className="text-[11px] text-rose-200/90 font-bengali leading-relaxed">
            {realWorldClinicalPearl.bn}
          </p>
        ) : (
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {realWorldClinicalPearl.en}
          </p>
        )}
      </div>
    </div>
  );
};
