/**
 * Real-world Artifact & Interference Synthesizer
 * Simulates clinical bedside conditions: baseline drift, EMG muscle tremor, 50/60Hz AC hum
 */

export interface NoiseParams {
  baselineWander: number;      // 0 to 1
  acInterference50Hz: number;  // 0 to 1
  muscleTremor: number;        // 0 to 1
  filterActive: boolean;       // Bandpass / Notch filter switch
}

/**
 * Computes noise voltage addition in mV for a given timestamp
 */
export function generateArtifacts(timeSec: number, params: NoiseParams, leadIndex = 0): number {
  let noiseMv = 0;

  // 1. Baseline Wander (Respiration ~ 0.2 Hz = 12 breaths/min)
  if (params.baselineWander > 0) {
    // Lead-dependent phase shift
    const phaseShift = leadIndex * 0.45;
    const wanderAmp = params.baselineWander * 0.28; // up to 0.28 mV (~2.8 mm drift)
    const drift = Math.sin(2 * Math.PI * 0.22 * timeSec + phaseShift) * wanderAmp +
                  Math.sin(2 * Math.PI * 0.08 * timeSec + phaseShift) * (wanderAmp * 0.4);
    
    // When medical high-pass filter is on (0.05 Hz), drift is attenuated by 85%
    noiseMv += params.filterActive ? drift * 0.15 : drift;
  }

  // 2. Powerline Hum (50 Hz mains alternating current)
  if (params.acInterference50Hz > 0) {
    const humAmp = params.acInterference50Hz * 0.12; // up to 0.12 mV
    const hum = Math.sin(2 * Math.PI * 50 * timeSec) * humAmp;
    
    // 50Hz Notch filter extinguishes 98% of powerline hum
    noiseMv += params.filterActive ? hum * 0.02 : hum;
  }

  // 3. EMG Muscle Shivering / Parkinsonian Tremor (Gaussian-like high frequency noise)
  if (params.muscleTremor > 0) {
    const tremorAmp = params.muscleTremor * 0.18; // up to 0.18 mV
    // Pseudo-random Gaussian approximation via Central Limit Theorem
    const rand = (Math.random() + Math.random() + Math.random() + Math.random() - 2.0);
    const tremor = rand * tremorAmp;
    
    // Low-pass muscle filter (35 Hz / 40 Hz) suppresses tremor by 75%
    noiseMv += params.filterActive ? tremor * 0.25 : tremor;
  }

  return noiseMv;
}
