export type LabMode = 'explore' | 'derive' | 'mitigate' | 'lab'

export interface SimulationParams {
  /** Train speed (m/s) */
  speedMs: number
  /** Train cross-section (m²) */
  trainArea: number
  /** Tunnel cross-section (m²) */
  tunnelArea: number
  /** Nose length (m) — controls pressure rise time */
  noseLength: number
  /** Tunnel length (m) */
  tunnelLength: number
  /** Ambient temperature (K) */
  temperatureK: number
  /** Ambient pressure (Pa) */
  ambientPressure: number
  /** Entry hood length (m); 0 = none */
  hoodLength: number
}

export interface DerivedQuantities {
  blockage: number
  soundSpeed: number
  mach: number
  deltaP: number
  deltaPOverP0: number
  riseTime: number
  characteristicFreq: number
  boomIndex: number
  portalGradient: number
  exteriorPeak: number
  entryDuration: number
  transitTime: number
}

export interface WaveSample {
  t: number
  interior: number
  portalGradient: number
  exterior: number
}

export interface SimulationResult {
  derived: DerivedQuantities
  samples: WaveSample[]
  duration: number
}
