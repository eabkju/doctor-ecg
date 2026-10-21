import React from 'react';
import { 
  Activity, 
  BookOpen, 
  Camera, 
  FlaskConical, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Palette,
  Globe
} from 'lucide-react';
import { AppMode, ECGTheme, LanguageMode } from '../types/ecg';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  theme: ECGTheme;
  onChangeTheme: (theme: ECGTheme) => void;
  langMode: LanguageMode;
  onChangeLangMode: (lang: LanguageMode) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  heartRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  theme,
  onChangeTheme,
  langMode,
  onChangeLangMode,
  isPlaying,
  onTogglePlay,
  onReset,
  soundEnabled,
  onToggleSound,
  heartRate
}) => {
  const themes: { id: ECGTheme; label: string; iconColor: string }[] = [
    { id: 'thermal', label: 'Classic Thermal Paper', iconColor: 'bg-red-400' },
    { id: 'icu', label: 'ICU Monitor (OLED)', iconColor: 'bg-emerald-400' },
    { id: 'daylight', label: 'Clinical Daylight (EHR)', iconColor: 'bg-blue-400' },
    { id: 'blueprint', label: 'Vector Lab Blueprint', iconColor: 'bg-cyan-400' },
    { id: 'crt', label: 'Retro Cath-Lab CRT', iconColor: 'bg-amber-400' },
    { id: 'high-contrast', label: 'High-Contrast Print', iconColor: 'bg-slate-400' }
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Live Vitals */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectMode('simulator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/20 ring-2 ring-red-500/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Doctor ECG</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Medical 12-Lead ECG & Bilingual Engine</p>
            </div>
          </div>

          {/* Quick mobile vitals badge */}
          <div className="md:hidden flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400">{heartRate} BPM</span>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectMode('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              currentMode === 'simulator'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => onSelectMode('atlas')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              currentMode === 'atlas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Atlas (100+)</span>
          </button>

          <button
            onClick={() => onSelectMode('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              currentMode === 'upload'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AI Digitize</span>
          </button>

          <button
            onClick={() => onSelectMode('sandbox')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              currentMode === 'sandbox'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Treat Strip</span>
          </button>

          <button
            onClick={() => onSelectMode('quiz')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              currentMode === 'quiz'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>OSCE Quiz</span>
          </button>
        </nav>

        {/* Action Toolbars: Lang, Theme, Sound, Playback */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 hidden sm:inline" />
            {(['en', 'bn', 'split'] as LanguageMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onChangeLangMode(m)}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                  langMode === m
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch to ${m.toUpperCase()} Mode`}
              >
                {m === 'en' ? 'EN' : m === 'bn' ? 'বাংলা' : 'Split'}
              </button>
            ))}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative group">
            <select
              value={theme}
              onChange={(e) => onChangeTheme(e.target.value as ECGTheme)}
              className="bg-slate-950 text-slate-200 text-xs py-1.5 pl-2.5 pr-6 rounded-lg border border-slate-800 hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <Palette className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Audio Beeper Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute ICU Beep' : 'Enable ICU Monitor Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded-lg border transition-all ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? 'Freeze Waveform' : 'Resume Sweep'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-all"
            title="Reset to Normal Sinus"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
