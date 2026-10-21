export type LeadName = 
  | 'I' | 'II' | 'III' 
  | 'aVR' | 'aVL' | 'aVF' 
  | 'V1' | 'V2' | 'V3' 
  | 'V4' | 'V5' | 'V6';

export type StandardLeadCategory = 
  | 'Limb (Einthoven)' 
  | 'Augmented Limb (Goldberger)' 
  | 'Precordial (Wilson)';

export type ECGTheme = 
  | 'thermal' 
  | 'icu' 
  | 'daylight' 
  | 'blueprint' 
  | 'crt' 
  | 'high-contrast';

export type LanguageMode = 'en' | 'bn' | 'split';

export type AppMode = 'simulator' | 'atlas' | 'upload' | 'sandbox' | 'quiz';

export interface LeadModifier {
  stElevationMm?: number; // ST elevation/depression in mm (-5 to +10)
  tWave?: 'normal' | 'peaked' | 'hyperacute' | 'inverted' | 'biphasic' | 'flattened';
  qWaveMm?: number; // Pathological Q-wave depth (negative)
  qrsVoltageMult?: number; // Multiplier for LVH/low-voltage
  deltaWave?: boolean; // WPW pre-excitation
  epsilonWave?: boolean; // ARVC
  bizarreMorphology?: boolean;
}

export interface SimulatorParams {
  heartRate: number; // 20 to 300 BPM
  rhythm: string;
  prIntervalMs: number; // 80 to 500 ms
  qrsDurationMs: number; // 60 to 240 ms
  qtIntervalMs?: number; // 200 to 700 ms
  qrsAxisDeg: number; // -90 to +180 deg
  leadModifiers: Partial<Record<LeadName, LeadModifier>>;
  // Artifacts & noise
  baselineWander: number; // 0.0 to 1.0 (drift magnitude)
  acInterference50Hz: number; // 0.0 to 1.0
  muscleTremor: number; // 0.0 to 1.0
  filterActive: boolean;
  leadReversal: 'none' | 'LA-RA' | 'RA-LL' | 'V1-V2-high';
}

export interface DiagnosticItem {
  step: number;
  param: string;
  en: string;
  bn: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface ECGCase {
  id: string;
  category: 
    | 'normal' 
    | 'arrhythmia' 
    | 'ventricular' 
    | 'blocks' 
    | 'ischemia_infarction' 
    | 'hypertrophy' 
    | 'channelopathy_pulmonary' 
    | 'electrolytes_drugs_pacer';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fellowship';
  urgency: 'Routine' | 'Urgent Review' | 'Cath Lab Activation (Code STEMI)' | 'Immediate Defibrillation/Resuscitation';
  title: {
    en: string;
    bn: string;
  };
  territory?: string;
  culpritArtery?: string;
  simulatorParams: SimulatorParams;
  diagnosticSteps: DiagnosticItem[];
  realWorldClinicalPearl: {
    en: string;
    bn: string;
  };
  lookAlikes?: {
    condition: string;
    keyDistinction: { en: string; bn: string };
  }[];
}

export interface CaliperMeasurement {
  active: boolean;
  p1: { x: number; y: number } | null;
  p2: { x: number; y: number } | null;
  timeDeltaMs: number;
  voltageDeltaMv: number;
  bpmEquivalent: number;
}

export interface QuizCase {
  id: string;
  title: { en: string; bn: string };
  patientInfo: {
    age: number;
    gender: 'Male' | 'Female';
    history: { en: string; bn: string };
    vitals: string;
  };
  ecgCaseId: string;
  question: { en: string; bn: string };
  options: { en: string; bn: string }[];
  correctIndex: number;
  clinicalExplanation: { en: string; bn: string };
  pearl: { en: string; bn: string };
}
