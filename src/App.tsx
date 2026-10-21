import React, { useState, useEffect } from 'react';
import { 
  AppMode, 
  ECGTheme, 
  LanguageMode, 
  SimulatorParams, 
  ECGCase 
} from './types/ecg';
import { ECG_DATABASE } from './data/ecgDatabase';
import { Header } from './components/Header';
import { ECGMonitor } from './components/ECGMonitor';
import { DigitalCaliper } from './components/DigitalCaliper';
import { ControlPanel } from './components/ControlPanel';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { HeartVisualizer } from './components/HeartVisualizer';
import { DiseaseAtlas } from './components/DiseaseAtlas';
import { CameraUploadDigitizer } from './components/CameraUploadDigitizer';
import { PharmacologySandbox } from './components/PharmacologySandbox';
import { OSCEQuizModal } from './components/OSCEQuizModal';
import { soundManager } from './audio/audioEngine';

export const App: React.FC = () => {
  // App-wide state
  const [currentMode, setCurrentMode] = useState<AppMode>('simulator');
  const [theme, setTheme] = useState<ECGTheme>('thermal');
  const [langMode, setLangMode] = useState<LanguageMode>('split');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [caliperActive, setCaliperActive] = useState<boolean>(false);
  const [highlightTerritories, setHighlightTerritories] = useState<boolean>(false);

  // Active case & simulator parameters
  const [activeCase, setActiveCase] = useState<ECGCase>(ECG_DATABASE[1]); // Default to Inferior STEMI with RV involvement
  const [params, setParams] = useState<SimulatorParams>(ECG_DATABASE[1].simulatorParams);

  // Synchronize data-theme on html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSelectCase = (c: ECGCase) => {
    setActiveCase(c);
    setParams({ ...c.simulatorParams });
    setCurrentMode('simulator');
  };

  const handleResetToNormal = () => {
    const normalCase = ECG_DATABASE[0];
    setActiveCase(normalCase);
    setParams({ ...normalCase.simulatorParams });
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setSoundEnabled(!muted);
  };

  const handleCloneFromDigitizer = (clonedParams: SimulatorParams, title: { en: string; bn: string }) => {
    const customCase: ECGCase = {
      ...ECG_DATABASE[1],
      id: 'custom-cloned-case',
      title,
      simulatorParams: clonedParams
    };
    setActiveCase(customCase);
    setParams(clonedParams);
    setCurrentMode('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        theme={theme}
        onChangeTheme={setTheme}
        langMode={langMode}
        onChangeLangMode={setLangMode}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={handleResetToNormal}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        heartRate={params.heartRate}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col space-y-4">
        {/* Interactive Caliper Tool Ribbon */}
        <DigitalCaliper
          active={caliperActive}
          onToggle={() => setCaliperActive(!caliperActive)}
          sweepSpeedMmSec={25}
          gainMmPerMv={10}
        />

        {/* View Switcher Container */}
        {currentMode === 'atlas' ? (
          <DiseaseAtlas
            onSelectCase={handleSelectCase}
            langMode={langMode}
            currentCaseId={activeCase.id}
          />
        ) : currentMode === 'upload' ? (
          <CameraUploadDigitizer
            onCloneToSimulator={handleCloneFromDigitizer}
          />
        ) : currentMode === 'sandbox' ? (
          <div className="space-y-4">
            <ECGMonitor
              params={params}
              isPlaying={isPlaying}
              theme={theme}
              highlightTerritories={highlightTerritories}
              onToggleTerritories={() => setHighlightTerritories(!highlightTerritories)}
              caliperActive={caliperActive}
            />
            <PharmacologySandbox
              currentParams={params}
              onApplyIntervention={setParams}
              onReset={handleResetToNormal}
            />
          </div>
        ) : currentMode === 'quiz' ? (
          <div className="space-y-4">
            <ECGMonitor
              params={params}
              isPlaying={isPlaying}
              theme={theme}
              highlightTerritories={highlightTerritories}
              onToggleTerritories={() => setHighlightTerritories(!highlightTerritories)}
              caliperActive={caliperActive}
            />
            <OSCEQuizModal
              langMode={langMode}
              onLoadCaseToSimulator={handleSelectCase}
            />
          </div>
        ) : (
          /* Default Simulator Workspace */
          <div className="flex flex-col space-y-4">
            {/* Top: 12-Lead Monitor Canvas */}
            <ECGMonitor
              params={params}
              isPlaying={isPlaying}
              theme={theme}
              highlightTerritories={highlightTerritories}
              onToggleTerritories={() => setHighlightTerritories(!highlightTerritories)}
              caliperActive={caliperActive}
            />

            {/* Bottom: 3-Column Diagnostic & Controls Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (5 cols): Parameter & Artifact Sliders + 3D Conduction */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <ControlPanel
                  params={params}
                  onChangeParams={setParams}
                />
                <HeartVisualizer
                  heartRate={params.heartRate}
                  qrsAxisDeg={params.qrsAxisDeg}
                  rhythm={params.rhythm}
                />
              </div>

              {/* Right Column (7 cols): Systematic 9-Step Diagnostic Panel & Pearls */}
              <div className="lg:col-span-7">
                <DiagnosticPanel
                  activeCase={activeCase}
                  langMode={langMode}
                  onSelectCase={(id) => {
                    const c = ECG_DATABASE.find((item) => item.id === id);
                    if (c) handleSelectCase(c);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clinical Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 text-xs py-4 px-4 text-center space-y-1">
        <p className="font-medium text-slate-400">
          Doctor ECG Pro &copy; 2026 • Medical-Grade 12-Lead Electrocardiogram Synthesis & Pedagogical AI Platform
        </p>
        <p className="text-[11px] text-slate-600 font-mono">
          Strict International Medical Calibration: 25 mm/s / 50 mm/s • 10 mm/mV • Dower Matrix Dipole Projection • English & বাংলা
        </p>
      </footer>
    </div>
  );
};

export default App;
