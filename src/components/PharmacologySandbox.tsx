import React, { useState } from 'react';
import { FlaskConical, Zap, ShieldAlert, Heart, CheckCircle2, RotateCcw } from 'lucide-react';
import { SimulatorParams } from '../types/ecg';
import { soundManager } from '../audio/audioEngine';

interface PharmacologySandboxProps {
  currentParams: SimulatorParams;
  onApplyIntervention: (updater: (prev: SimulatorParams) => SimulatorParams) => void;
  onReset: () => void;
}

export const PharmacologySandbox: React.FC<PharmacologySandboxProps> = ({
  currentParams,
  onApplyIntervention,
  onReset
}) => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 4500);
  };

  // 1. IV Adenosine Rapid Flush (for SVT / Tachycardia)
  const handleAdenosine = () => {
    soundManager.playCriticalAlarm();
    triggerFeedback('Administering IV Adenosine 6mg rapid push + 20ml saline flush. Transient asystole/pause induced...');

    // Transient pause
    onApplyIntervention((prev) => ({
      ...prev,
      heartRate: 20,
      rhythm: 'asystole'
    }));

    setTimeout(() => {
      onApplyIntervention((prev) => ({
        ...prev,
        heartRate: 74,
        rhythm: 'normal_sinus',
        prIntervalMs: 160,
        qrsDurationMs: 84
      }));
      triggerFeedback('Adenosine cleared: Re-entry pathway terminated! Normal Sinus Rhythm restored.');
    }, 3500);
  };

  // 2. IV Calcium Gluconate + Insulin/Dextrose (for Hyperkalemia)
  const handleCalciumInsulin = () => {
    triggerFeedback('Administering IV 10% Calcium Gluconate 10ml + 10U Regular Insulin in 50% Dextrose. Membrane stabilized...');
    onApplyIntervention((prev) => ({
      ...prev,
      qrsDurationMs: 88,
      prIntervalMs: 165,
      leadModifiers: {}
    }));
  };

  // 3. IV Atropine (for Bradycardia / Heart Block)
  const handleAtropine = () => {
    triggerFeedback('Administering IV Atropine 1mg bolus. Vagolytic acceleration in progress...');
    onApplyIntervention((prev) => ({
      ...prev,
      heartRate: Math.min(110, prev.heartRate + 40),
      prIntervalMs: Math.max(130, prev.prIntervalMs - 40)
    }));
  };

  // 4. Synchronized Cardioversion (for Unstable VT / AFib)
  const handleSynchronizedCardioversion = () => {
    soundManager.playCriticalAlarm();
    triggerFeedback('SYNC BUTTON ENGAGED (R-wave synchronized shock at 100J delivered). CLEAR!');
    setTimeout(() => {
      onApplyIntervention((prev) => ({
        ...prev,
        heartRate: 76,
        rhythm: 'normal_sinus',
        qrsDurationMs: 86,
        prIntervalMs: 160,
        leadModifiers: {}
      }));
      triggerFeedback('Cardioversion Successful: Converted to Normal Sinus Rhythm (NSR).');
    }, 1500);
  };

  // 5. Unsynchronized Defibrillation (200J Biphasic for VFib)
  const handleDefibrillation = () => {
    soundManager.playCriticalAlarm();
    triggerFeedback('CHARGING DEFIBRILLATOR TO 200J BIPHASIC... STAND CLEAR! SHOCK DELIVERED!');
    setTimeout(() => {
      onApplyIntervention((prev) => ({
        ...prev,
        heartRate: 80,
        rhythm: 'normal_sinus',
        qrsDurationMs: 85,
        prIntervalMs: 155,
        leadModifiers: {}
      }));
      triggerFeedback('ROSC Achieved (Return of Spontaneous Circulation): Sinus rhythm restored!');
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl text-slate-200">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Emergency Pharmacology & Defibrillation Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              "Treat the Strip": Administer virtual interventions and observe live electrophysiological response
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Strip</span>
        </button>
      </div>

      {/* Live status alert banner */}
      {actionFeedback && (
        <div className="bg-amber-950/60 border border-amber-500/50 p-3 rounded-xl flex items-center space-x-2.5 text-xs text-amber-200 animate-fade-in">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span className="font-mono">{actionFeedback}</span>
        </div>
      )}

      {/* Intervention Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Adenosine */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Antiarrhythmic</span>
            <h4 className="text-xs font-bold text-white mt-0.5">IV Adenosine 6mg / 12mg</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Blocks AV node for 4s. Terminates AVNRT/SVT or unmasks flutter waves.
            </p>
          </div>
          <button
            onClick={handleAdenosine}
            className="w-full py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Push Rapid Adenosine
          </button>
        </div>

        {/* Calcium Gluconate + Insulin */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Membrane Stabilizer</span>
            <h4 className="text-xs font-bold text-white mt-0.5">IV Calcium + Insulin-Dextrose</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Stabilizes myocyte resting membrane; treats peaked T waves and sine waves.
            </p>
          </div>
          <button
            onClick={handleCalciumInsulin}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Give Calcium + Insulin
          </button>
        </div>

        {/* Atropine */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">Anticholinergic</span>
            <h4 className="text-xs font-bold text-white mt-0.5">IV Atropine 1mg Bolus</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Increases sinus node firing and AV conduction in symptomatic bradycardia.
            </p>
          </div>
          <button
            onClick={handleAtropine}
            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Administer Atropine
          </button>
        </div>

        {/* Synchronized Cardioversion */}
        <div className="bg-slate-950 p-3 rounded-xl border border-amber-900/50 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Synchronized Electrical</span>
            <h4 className="text-xs font-bold text-white mt-0.5">Synchronized Cardioversion (100J)</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Fires shock precisely on R-wave to avoid fatal R-on-T ventricular fibrillation.
            </p>
          </div>
          <button
            onClick={handleSynchronizedCardioversion}
            className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Deliver SYNC Shock
          </button>
        </div>

        {/* Unsynchronized Defibrillation */}
        <div className="bg-slate-950 p-3 rounded-xl border border-rose-900/50 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">Cardiac Arrest (Code Blue)</span>
            <h4 className="text-xs font-bold text-white mt-0.5">Defibrillation (200J Biphasic)</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Immediate unsynchronized shock for pulseless VT or Ventricular Fibrillation (VF).
            </p>
          </div>
          <button
            onClick={handleDefibrillation}
            className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-all animate-pulse"
          >
            DEFIB SHOCK (200J)
          </button>
        </div>
      </div>
    </div>
  );
};
