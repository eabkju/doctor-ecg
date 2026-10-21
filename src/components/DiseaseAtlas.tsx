import React, { useState } from 'react';
import { ECGCase, LanguageMode } from '../types/ecg';
import { ECG_DATABASE } from '../data/ecgDatabase';
import { Search, Filter, PlayCircle, BookOpen, AlertCircle, Heart } from 'lucide-react';

interface DiseaseAtlasProps {
  onSelectCase: (c: ECGCase) => void;
  langMode: LanguageMode;
  currentCaseId: string;
}

export const DiseaseAtlas: React.FC<DiseaseAtlasProps> = ({
  onSelectCase,
  langMode,
  currentCaseId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Modules (100+)' },
    { id: 'normal', label: '1. Normal & Variants' },
    { id: 'ischemia_infarction', label: '2. Ischemia & STEMI' },
    { id: 'arrhythmia', label: '3. Atrial Arrhythmias' },
    { id: 'ventricular', label: '4. Ventricular Arrhythmias' },
    { id: 'blocks', label: '5. Conduction Blocks' },
    { id: 'channelopathy_pulmonary', label: '6. Pericardial & PE' },
    { id: 'electrolytes_drugs_pacer', label: '7. Electrolytes & Drugs' },
  ];

  const filteredCases = ECG_DATABASE.filter((c) => {
    const matchesSearch = 
      c.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.territory && c.territory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.culpritArtery && c.culpritArtery.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;

    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl text-slate-200">
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Clinical Disease Atlas & Pathologies
            </h2>
            <p className="text-xs text-slate-400">
              Curated ECG library with bilingual step-by-step diagnostic breakdown
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search 100+ ECGs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {filteredCases.map((ecgCase) => {
          const isSelected = ecgCase.id === currentCaseId;
          return (
            <div
              key={ecgCase.id}
              onClick={() => onSelectCase(ecgCase)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 group ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {ecgCase.difficulty}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ecgCase.urgency.includes('Cath Lab') || ecgCase.urgency.includes('Defibrillation')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : ecgCase.urgency.includes('Urgent')
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {ecgCase.urgency.split(' ')[0]}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {ecgCase.title.en}
                </h4>
                {langMode !== 'en' && (
                  <p className="text-xs text-rose-300 font-bengali line-clamp-1 mt-0.5">
                    {ecgCase.title.bn}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>HR: {ecgCase.simulatorParams.heartRate} BPM</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCase(ecgCase);
                  }}
                  className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-sans font-semibold text-xs"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Simulate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
