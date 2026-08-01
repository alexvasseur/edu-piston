import { GAMMA, R_AIR } from './constants'
import type {
  DerivedQuantities,
  SimulationParams,
  SimulationResult,
  WaveSample,
} from './types'

export function soundSpeed(temperatureK: number): number {
  return Math.sqrt(GAMMA * R_AIR * temperatureK)
}

export function blockageRatio(trainArea: number, tunnelArea: number): number {
  if (tunnelArea <= 0) return 0
  return Math.min(0.95, Math.max(0, trainArea / tunnelArea))
}

/**
 * Idealized inviscid piston pressure rise (teaching form).
 * Δp/p0 ≈ γ M² β / (1−β)²
 */
export function pressureRiseRatio(mach: number, blockage: number): number {
  const denom = (1 - blockage) ** 2
  if (denom < 1e-6) return Number.POSITIVE_INFINITY
  return (GAMMA * mach * mach * blockage) / denom
}

/**
 * Effective rise length includes optional portal hood.
 * Longer nose / hood → slower rise → weaker radiated boom for similar Δp.
 */
export function effectiveRiseLength(noseLength: number, hoodLength: number): number {
  return Math.max(0.5, noseLength + 0.65 * hoodLength)
}

export function deriveQuantities(params: SimulationParams): DerivedQuantities {
  const c = soundSpeed(params.temperatureK)
  const beta = blockageRatio(params.trainArea, params.tunnelArea)
  const mach = params.speedMs / c
  const dpOverP0 = pressureRiseRatio(mach, beta)
  const deltaP = dpOverP0 * params.ambientPressure
  const Lr = effectiveRiseLength(params.noseLength, params.hoodLength)
  const riseTime = Lr / Math.max(params.speedMs, 0.1)
  const characteristicFreq = 1 / Math.max(riseTime, 1e-4)
  const portalGradient = deltaP / Math.max(riseTime, 1e-4)
  // Exterior micro-pressure scales with portal ∂p/∂t (teaching proportionality).
  const exteriorPeak = 0.012 * portalGradient * Math.sqrt(beta)
  // Boom index: relative loudness proxy from peak and rise time (not a certified dB).
  const boomIndex = exteriorPeak * Math.sqrt(characteristicFreq) * 1e-3
  const entryDuration = Lr / Math.max(params.speedMs, 0.1)
  const transitTime = params.tunnelLength / c

  return {
    blockage: beta,
    soundSpeed: c,
    mach,
    deltaP,
    deltaPOverP0: dpOverP0,
    riseTime,
    characteristicFreq,
    boomIndex,
    portalGradient,
    exteriorPeak,
    entryDuration,
    transitTime,
  }
}

function smoothstep(x: number): number {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

/**
 * Synthetic but physically motivated waveforms for classroom scrubbing:
 * - interior compression rises over entry, holds, then relaxes after exit radiation
 * - portal gradient peaks during the steep part of the exit-ready front
 * - exterior pulse ≈ differentiated, delayed portal signature
 */
export function simulate(params: SimulationParams, sampleCount = 480): SimulationResult {
  const derived = deriveQuantities(params)
  const duration =
    derived.entryDuration + derived.transitTime + 4 * derived.riseTime + 1.5
  const samples: WaveSample[] = []

  // Mild nonlinear steepening proxy: longer tunnels / stronger Δp sharpen the front.
  const steepen = Math.min(
    0.85,
    0.15 + 0.0004 * params.tunnelLength * derived.deltaPOverP0,
  )

  for (let i = 0; i < sampleCount; i++) {
    const t = (i / (sampleCount - 1)) * duration
    const tEntryEnd = derived.entryDuration
    const tPortal = tEntryEnd + derived.transitTime
    const tr = derived.riseTime * (1 - 0.55 * steepen)

    // Interior pressure near a mid-tunnel sensor (teaching cartoon).
    let interior = 0
    if (t < tEntryEnd) {
      interior = derived.deltaP * smoothstep(t / tEntryEnd)
    } else if (t < tPortal) {
      interior = derived.deltaP
    } else {
      const tau = (t - tPortal) / Math.max(tr, 1e-4)
      interior = derived.deltaP * (1 - smoothstep(tau))
    }

    // Portal temporal gradient (Pa/s), peaked around radiation window.
    const u = (t - tPortal) / Math.max(tr, 1e-4)
    const portalGradient =
      derived.portalGradient * Math.exp(-0.5 * ((u - 0.35) / 0.28) ** 2) * (1 + steepen)

    // Exterior micro-pressure pulse (Pa), slightly delayed & broadened.
    const ue = (t - (tPortal + 0.15 * tr)) / Math.max(tr * 1.1, 1e-4)
    const exterior =
      derived.exteriorPeak *
      Math.exp(-0.5 * ((ue - 0.2) / 0.32) ** 2) *
      (1 - 0.35 * ue)

    samples.push({ t, interior, portalGradient, exterior })
  }

  return { derived, samples, duration }
}

export function kmhToMs(kmh: number): number {
  return kmh / 3.6
}

export function msToKmh(ms: number): number {
  return ms * 3.6
}

export function formatSci(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs < 1e-2 || abs >= 1e4)) return value.toExponential(digits - 1)
  return value.toLocaleString(undefined, { maximumFractionDigits: digits })
}
