import React, { useState } from 'react';
import { QuizCase, LanguageMode, ECGCase } from '../types/ecg';
import { OSCE_QUIZ_CASES } from '../data/quizDatabase';
import { ECG_DATABASE } from '../data/ecgDatabase';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Award, User, Activity, AlertTriangle } from 'lucide-react';

interface OSCEQuizModalProps {
  langMode: LanguageMode;
  onLoadCaseToSimulator: (c: ECGCase) => void;
}

export const OSCEQuizModal: React.FC<OSCEQuizModalProps> = ({
  langMode,
  onLoadCaseToSimulator
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const activeQuiz = OSCE_QUIZ_CASES[currentIdx];
  const linkedEcg = ECG_DATABASE.find((c) => c.id === activeQuiz.ecgCaseId);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === activeQuiz.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIdx((prev) => (prev + 1) % OSCE_QUIZ_CASES.length);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl text-slate-200">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              OSCE Exam & Code Blue Simulator Drills
            </h2>
            <p className="text-xs text-slate-400">
              Real-world ward clinical vignettes with bedside ECG evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Score: {score} / {OSCE_QUIZ_CASES.length}</span>
          </div>
        </div>
      </div>

      {/* Patient Vignette Card */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Patient Profile: {activeQuiz.patientInfo.age}yo {activeQuiz.patientInfo.gender}</span>
          </span>
          <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-300">
            {activeQuiz.patientInfo.vitals}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white">
          {activeQuiz.title.en}
        </h3>

        {/* History in EN / BN */}
        {langMode !== 'bn' && (
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeQuiz.patientInfo.history.en}
          </p>
        )}
        {langMode !== 'en' && (
          <p className="text-xs text-rose-300 font-bengali leading-relaxed">
            {activeQuiz.patientInfo.history.bn}
          </p>
        )}

        {/* Preview strip action */}
        {linkedEcg && (
          <button
            onClick={() => onLoadCaseToSimulator(linkedEcg)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 pt-1"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Load ECG trace onto main screen monitor</span>
          </button>
        )}
      </div>

      {/* Question */}
      <div className="space-y-2">
        <div className="font-bold text-xs text-white">
          {langMode !== 'bn' && <p>{activeQuiz.question.en}</p>}
          {langMode !== 'en' && <p className="font-bengali text-rose-300 mt-0.5">{activeQuiz.question.bn}</p>}
        </div>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {activeQuiz.options.map((opt, idx) => {
            const isChosen = selectedOption === idx;
            const isCorrect = idx === activeQuiz.correctIndex;

            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
              } else if (isChosen) {
                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }
            } else if (isChosen) {
              btnStyle = 'bg-blue-950/50 border-blue-500 text-white';
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="space-y-0.5">
                  {langMode !== 'bn' && <p className="font-medium">{opt.en}</p>}
                  {langMode !== 'en' && <p className="font-bengali text-slate-400">{opt.bn}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit / Next Button */}
      <div className="pt-2 flex justify-end">
        {!isSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
          >
            <span>Next Case ({currentIdx + 1}/{OSCE_QUIZ_CASES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Explanation Box on Submit */}
      {isSubmitted && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs animate-fade-in">
          <div className="flex items-center space-x-1.5 font-bold">
            {selectedOption === activeQuiz.correctIndex ? (
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct Answer!</span>
              </span>
            ) : (
              <span className="text-rose-400 flex items-center space-x-1">
                <XCircle className="w-4 h-4" />
                <span>Incorrect Selection</span>
              </span>
            )}
          </div>

          <div className="text-slate-300 leading-relaxed space-y-1">
            {langMode !== 'bn' && <p>{activeQuiz.clinicalExplanation.en}</p>}
            {langMode !== 'en' && <p className="font-bengali text-rose-200">{activeQuiz.clinicalExplanation.bn}</p>}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-start space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Bedside Takeaway: </span>
              {langMode !== 'bn' ? activeQuiz.pearl.en : activeQuiz.pearl.bn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
