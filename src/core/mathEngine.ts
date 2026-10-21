import { SimulatorParams, LeadName } from '../types/ecg';

/**
 * Medical-Grade 12-Lead ECG Mathematical Synthesis Engine
 * Implements 3D Dipole Vector Generation + Inverse Dower Matrix & Einthoven/Goldberger Equations
 */

// Inverse Dower Transformation Matrix: projects [Px, Py, Pz] onto standard leads
// Row order: [Lead I, Lead II, V1, V2, V3, V4, V5, V6]
const DOWER_MATRIX = [
  // Px (right-left), Py (cranio-caudal), Pz (antero-posterior)
  [ 0.156, -0.009, -0.043], // Lead I
  [ 0.027,  0.871, -0.117], // Lead II
  [-0.515,  0.157, -0.917], // V1
  [ 0.044,  0.164, -1.387], // V2
  [ 0.882,  0.098, -1.277], // V3
  [ 1.213,  0.127, -0.601], // V4
  [ 1.125,  0.127, -0.086], // V5
  [ 0.831,  0.076,  0.230], // V6
];

export interface WaveformPoint {
  t: number; // time in seconds
  voltage: number; // in mV
  phase: 'isoelectric' | 'P' | 'PR' | 'QRS' | 'ST' | 'T' | 'U';
}

export interface ComputedECGState {
  sampleRate: number; // Hz (typically 500 Hz)
  hr: number;
  rrSec: number;
  qtcBazettMs: number;
  qtcFridericiaMs: number;
}

/**
 * Calculates live QTc using Bazett's and Fridericia's formulas
 */
export function calculateQTc(qtMs: number, hr: number): { bazett: number; fridericia: number } {
  if (!qtMs || qtMs <= 0) {
    return { bazett: 0, fridericia: 0 };
  }
  const rrSec = 60 / Math.max(20, Math.min(300, hr));
  const qtSec = qtMs / 1000;
  const bazett = Math.round((qtSec / Math.sqrt(rrSec)) * 1000);
  const fridericia = Math.round((qtSec / Math.cbrt(rrSec)) * 1000);
  return { bazett, fridericia };
}

/**
 * Evaluates Gaussian wave component: a * exp( -((theta - mu)^2) / (2 * b^2) )
 */
function gaussian(theta: number, a: number, b: number, mu: number): number {
  let diff = theta - mu;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff += 2 * Math.PI;
  return a * Math.exp(-(diff * diff) / (2 * b * b));
}

/**
 * Generates continuous biophysical 3D cardiac vector [Px, Py, Pz]
 * Supports Dual-Oscillator architecture for AV Dissociation & Flutter
 */
export function computeCardiacDipole(
  theta: number,
  params: SimulatorParams,
  axisRad: number,
  currentTimeSec?: number
): [number, number, number] {
  const { rhythm, qrsDurationMs } = params;

  // Handle Ventricular Fibrillation (chaotic waves)
  if (rhythm === 'ventricular_fibrillation' || rhythm === 'coarse_vf') {
    const chaoticPx = 0.4 * Math.sin(theta * 3.2) + 0.3 * Math.cos(theta * 7.1) + 0.2 * Math.sin(theta * 13.5);
    const chaoticPy = 0.5 * Math.sin(theta * 2.8 + 1.2) + 0.35 * Math.cos(theta * 5.7);
    const chaoticPz = 0.3 * Math.sin(theta * 4.1 + 2.5);
    return [chaoticPx, chaoticPy, chaoticPz];
  }

  // Handle Asystole (flat line with micro-baseline wander)
  if (rhythm === 'asystole') {
    return [0.008 * Math.sin(theta), 0.008 * Math.cos(theta), 0];
  }

  // Ventricular Tachycardia (wide, monomorphic or polymorphic)
  if (rhythm.includes('ventricular_tachycardia') || rhythm.includes('monomorphic_vt') || rhythm.includes('torsades')) {
    const isTdp = rhythm.includes('torsades');
    const tdpEnvelope = isTdp ? Math.sin(theta * 0.25) : 1.0;
    const wideQrs = Math.pow(Math.sin(theta), 3) * 1.8 * tdpEnvelope;
    const px = wideQrs * Math.cos(axisRad) * 0.8;
    const py = wideQrs * Math.sin(axisRad) * 1.2;
    const pz = -wideQrs * 0.6;
    return [px, py, pz];
  }

  // Atrial Depolarization (P-wave)
  let pAmp = 0.18;
  let pWidth = 0.16;
  let pTheta = -1.9;
  let P_wave = 0;

  if (rhythm.includes('atrial_fibrillation')) {
    // Chaotic fibrillatory 'f' waves without distinct P-waves
    P_wave = 0.045 * (Math.sin(theta * 16) + Math.cos(theta * 22) + Math.sin(theta * 34));
  } else if (rhythm.includes('atrial_flutter')) {
    // Classical ~300 bpm counter-clockwise sawtooth 'F' waves (every 0.2s)
    if (currentTimeSec !== undefined) {
      const flutterPhase = ((currentTimeSec % 0.2) / 0.2) * 2 * Math.PI;
      P_wave = 0.22 * (Math.sin(flutterPhase) - 0.45 * Math.sin(2 * flutterPhase));
    } else {
      P_wave = 0.22 * Math.sin(theta * 4);
    }
  } else if (rhythm.includes('av_block_3rd_degree') && currentTimeSec !== undefined) {
    // DUAL-OSCILLATOR: Independent SA Nodal Pacemaker running at 75 BPM (period = 0.8s)
    const atrialPeriod = 0.8; // 75 BPM
    const atrialTheta = ((currentTimeSec % atrialPeriod) / atrialPeriod) * 2 * Math.PI - Math.PI;
    P_wave = gaussian(atrialTheta, pAmp, pWidth, pTheta);
  } else {
    if (rhythm.includes('p_mitrale')) {
      pAmp = 0.24;
      pWidth = 0.26;
    } else if (rhythm.includes('p_pulmonale')) {
      pAmp = 0.38;
      pWidth = 0.12;
    }
    P_wave = gaussian(theta, pAmp, pWidth, pTheta);
  }

  // QRS parameters based on qrsDuration
  const qrsWidthFactor = Math.max(0.6, qrsDurationMs / 90);
  const qAmp = -0.15;
  const qWidth = 0.04 * qrsWidthFactor;
  const qTheta = -0.12;

  const rAmp = 1.35;
  const rWidth = 0.07 * qrsWidthFactor;
  const rTheta = 0.0;

  const sAmp = -0.35;
  const sWidth = 0.06 * qrsWidthFactor;
  const sTheta = 0.14;

  // Repolarization (T-wave)
  const tAmp = 0.32;
  const tWidth = 0.35;
  const tTheta = 1.6;

  // Q, R, S waves
  const Q_wave = gaussian(theta, qAmp, qWidth, qTheta);
  const R_wave = gaussian(theta, rAmp, rWidth, rTheta);
  const S_wave = gaussian(theta, sAmp, sWidth, sTheta);
  const QRS_wave = Q_wave + R_wave + S_wave;

  // T wave
  const T_wave = gaussian(theta, tAmp, tWidth, tTheta);

  // Combine along 3 axes modulated by mean frontal QRS electrical axis
  const Px = (P_wave * 0.3) + (QRS_wave * Math.cos(axisRad) * 0.85) + (T_wave * 0.4);
  const Py = (P_wave * 0.9) + (QRS_wave * Math.sin(axisRad) * 1.10) + (T_wave * 0.75);
  const Pz = -(P_wave * 0.2) - (QRS_wave * 0.55) - (T_wave * 0.3);

  return [Px, Py, Pz];
}

/**
 * Computes voltages for all 12 standard leads given the 3D cardiac vector P(t) and lead modifiers
 */
export function projectTo12Leads(
  dipole: [number, number, number],
  params: SimulatorParams,
  theta: number
): Record<LeadName, number> {
  const [Px, Py, Pz] = dipole;
  const { leadModifiers, leadReversal } = params;

  // 1. Compute 8 independent leads using Inverse Dower Matrix
  // Row order: [Lead I, Lead II, V1, V2, V3, V4, V5, V6]
  const rawI  = DOWER_MATRIX[0][0] * Px + DOWER_MATRIX[0][1] * Py + DOWER_MATRIX[0][2] * Pz;
  const rawII = DOWER_MATRIX[1][0] * Px + DOWER_MATRIX[1][1] * Py + DOWER_MATRIX[1][2] * Pz;
  const rawV1 = DOWER_MATRIX[2][0] * Px + DOWER_MATRIX[2][1] * Py + DOWER_MATRIX[2][2] * Pz;
  const rawV2 = DOWER_MATRIX[3][0] * Px + DOWER_MATRIX[3][1] * Py + DOWER_MATRIX[3][2] * Pz;
  const rawV3 = DOWER_MATRIX[4][0] * Px + DOWER_MATRIX[4][1] * Py + DOWER_MATRIX[4][2] * Pz;
  const rawV4 = DOWER_MATRIX[5][0] * Px + DOWER_MATRIX[5][1] * Py + DOWER_MATRIX[5][2] * Pz;
  const rawV5 = DOWER_MATRIX[6][0] * Px + DOWER_MATRIX[6][1] * Py + DOWER_MATRIX[6][2] * Pz;
  const rawV6 = DOWER_MATRIX[7][0] * Px + DOWER_MATRIX[7][1] * Py + DOWER_MATRIX[7][2] * Pz;

  // 2. Einthoven's Law & Goldberger's Equations
  const rawIII = rawII - rawI;
  const rawAVR = -(rawI + rawII) / 2;
  const rawAVL = rawI - (rawII / 2);
  const rawAVF = rawII - (rawI / 2);

  const leads: Record<LeadName, number> = {
    'I': rawI,
    'II': rawII,
    'III': rawIII,
    'aVR': rawAVR,
    'aVL': rawAVL,
    'aVF': rawAVF,
    'V1': rawV1,
    'V2': rawV2,
    'V3': rawV3,
    'V4': rawV4,
    'V5': rawV5,
    'V6': rawV6
  };

  // 3. Apply Lead Reversal Artifacts if enabled with full mathematical consistency
  if (leadReversal === 'LA-RA') {
    // Swapping Left Arm and Right Arm reverses Lead I, swaps Lead II and III, swaps aVR and aVL
    const tempI = leads['I'];
    leads['I'] = -tempI;
    const tempII = leads['II'];
    leads['II'] = leads['III'];
    leads['III'] = tempII;
    const tempAVR = leads['aVR'];
    leads['aVR'] = leads['aVL'];
    leads['aVL'] = tempAVR;
  } else if (leadReversal === 'RA-LL') {
    // Swapping Right Arm and Left Leg:
    // I = -III, II = -II, III = -I, aVR = -aVF, aVF = -aVR
    const oldI = leads['I'];
    const oldII = leads['II'];
    const oldIII = leads['III'];
    leads['I'] = -oldIII;
    leads['II'] = -oldII;
    leads['III'] = -oldI;
    const oldAVR = leads['aVR'];
    leads['aVR'] = -leads['aVF'];
    leads['aVF'] = -oldAVR;
  } else if (leadReversal === 'V1-V2-high') {
    leads['V1'] = leads['V1'] * 0.6 + 0.1 * Math.sin(theta);
    leads['V2'] = leads['V2'] * 0.7;
  }

  // 4. Apply clinical lead modifiers (ST elevation/depression, hyperacute T, deep Q-waves)
  const isSTPhase = theta > 0.25 && theta < 1.45;
  const stEnvelope = Math.sin((theta - 0.25) / 1.2 * Math.PI);

  const isTPhase = theta > 1.2 && theta < 2.2;
  const tEnvelope = Math.sin((theta - 1.2) / 1.0 * Math.PI);

  for (const [leadKey, mod] of Object.entries(leadModifiers)) {
    const lead = leadKey as LeadName;
    // Strict undefined check (replaces faulty !leads[lead] zero-crossing bug)
    if (!mod || leads[lead] === undefined) continue;

    // ST elevation/depression (1mm = 0.1 mV)
    if (mod.stElevationMm !== undefined && isSTPhase) {
      const stOffsetMv = (mod.stElevationMm * 0.1) * Math.max(0, stEnvelope);
      leads[lead] += stOffsetMv;
    }

    // Pathological Q-wave depth (in mm)
    if (mod.qWaveMm !== undefined && mod.qWaveMm !== 0 && theta > -0.2 && theta < 0.0) {
      leads[lead] += (mod.qWaveMm * 0.1) * Math.cos((theta + 0.1) * 15);
    }

    // T wave modifications
    if (mod.tWave && isTPhase) {
      if (mod.tWave === 'hyperacute') {
        leads[lead] += 0.45 * tEnvelope; // Tall, broad, symmetric
      } else if (mod.tWave === 'peaked') {
        leads[lead] += 0.55 * Math.pow(tEnvelope, 2); // Tent-like peaked (Hyperkalemia)
      } else if (mod.tWave === 'inverted') {
        leads[lead] -= 0.65 * tEnvelope; // Symmetric deep inversion
      } else if (mod.tWave === 'flattened') {
        leads[lead] -= 0.24 * tEnvelope; // Hypokalemia / ischemia
      } else if (mod.tWave === 'biphasic') {
        leads[lead] += 0.3 * Math.sin((theta - 1.2) * 2 * Math.PI); // Wellens Type A
      }
    }

    // Delta wave (Wolff-Parkinson-White) slurring in PR-QRS transition
    if (mod.deltaWave && theta > -0.4 && theta < -0.1) {
      leads[lead] += 0.25 * Math.cos((theta + 0.25) * 8);
    }

    // Epsilon wave (ARVC) notch at end of QRS
    if (mod.epsilonWave && theta > 0.15 && theta < 0.35) {
      leads[lead] += 0.12 * Math.sin((theta - 0.15) * 25);
    }

    // RBBB rsR' "rabbit ears" in V1-V2
    if (mod.bizarreMorphology && (lead === 'V1' || lead === 'V2') && theta > 0.08 && theta < 0.24) {
      leads[lead] += 0.45 * Math.sin((theta - 0.08) * 20);
    }

    // Voltage multiplier (LVH / low voltage)
    if (mod.qrsVoltageMult !== undefined) {
      leads[lead] *= mod.qrsVoltageMult;
    }
  }

  return leads;
}
