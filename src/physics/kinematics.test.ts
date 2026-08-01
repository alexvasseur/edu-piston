import { describe, expect, it } from 'vitest'
import { trainTipX } from './kinematics'

describe('trainTipX', () => {
  const base = {
    tunnelLength: 800,
    portalIn: 120,
    portalOut: 800,
    approachMeters: 55,
    exitMeters: 40,
  }

  it('moves farther in the same time when speed increases', () => {
    const slow = trainTipX({ ...base, simTime: 2, speedMs: 40 })
    const fast = trainTipX({ ...base, simTime: 2, speedMs: 90 })
    expect(fast).toBeGreaterThan(slow + 50)
  })

  it('is continuous in time (no jumps)', () => {
    let prev = trainTipX({ ...base, simTime: 0, speedMs: 70 })
    for (let i = 1; i <= 200; i++) {
      const x = trainTipX({ ...base, simTime: (i / 200) * 4, speedMs: 70 })
      expect(x).toBeGreaterThanOrEqual(prev)
      expect(x - prev).toBeLessThan(20)
      prev = x
    }
  })

  it('does not pass the exit run-out clamp', () => {
    const x = trainTipX({ ...base, simTime: 100, speedMs: 120 })
    const tipEnd = 800 + 40 * ((800 - 120) / 800)
    expect(x).toBeCloseTo(tipEnd, 5)
  })
})
