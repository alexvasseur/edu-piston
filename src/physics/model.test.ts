import { describe, expect, it } from 'vitest'
import { DEFAULT_PARAMS } from './constants'
import {
  blockageRatio,
  deriveQuantities,
  pressureRiseRatio,
  simulate,
  soundSpeed,
} from './model'

describe('piston effect teaching model', () => {
  it('computes dry-air sound speed near 340 m/s at 15°C', () => {
    const c = soundSpeed(288.15)
    expect(c).toBeGreaterThan(340)
    expect(c).toBeLessThan(341.5)
  })

  it('increases pressure rise with blockage and Mach', () => {
    const low = pressureRiseRatio(0.1, 0.15)
    const highBeta = pressureRiseRatio(0.1, 0.35)
    const highMach = pressureRiseRatio(0.2, 0.15)
    expect(highBeta).toBeGreaterThan(low)
    expect(highMach).toBeGreaterThan(low)
  })

  it('keeps blockage in (0,1) for valid areas', () => {
    expect(blockageRatio(10, 40)).toBeCloseTo(0.25)
    expect(blockageRatio(10, 0)).toBe(0)
  })

  it('lengthens rise time when hood is added', () => {
    const base = deriveQuantities(DEFAULT_PARAMS)
    const withHood = deriveQuantities({ ...DEFAULT_PARAMS, hoodLength: 40 })
    expect(withHood.riseTime).toBeGreaterThan(base.riseTime)
    expect(withHood.boomIndex).toBeLessThan(base.boomIndex)
  })

  it('returns synchronized waveform samples covering the event', () => {
    const result = simulate(DEFAULT_PARAMS, 200)
    expect(result.samples).toHaveLength(200)
    expect(result.duration).toBeGreaterThan(result.derived.transitTime)
    const maxInterior = Math.max(...result.samples.map((s) => s.interior))
    expect(maxInterior).toBeGreaterThan(0.5 * result.derived.deltaP)
    const maxExterior = Math.max(...result.samples.map((s) => s.exterior))
    expect(maxExterior).toBeGreaterThan(0)
  })
})
