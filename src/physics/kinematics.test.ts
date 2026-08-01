import { describe, expect, it } from 'vitest'
import { trainEntryTime, trainTipX, waveFrontState } from './kinematics'

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

describe('waveFrontState', () => {
  const base = {
    speedMs: 70,
    soundSpeed: 340,
    tunnelLength: 800,
    portalIn: 120,
    portalOut: 800,
    entryDuration: 0.12,
    approachMeters: 55,
  }

  it('stays inactive until the train tip reaches the entry portal', () => {
    const tEnter = trainEntryTime(base.speedMs, base.approachMeters)
    const before = waveFrontState({ ...base, simTime: tEnter * 0.5 })
    expect(before.frontActive).toBe(false)
    expect(before.genTime).toBeGreaterThanOrEqual(tEnter)
  })

  it('activates only after entry, then advances with sound speed', () => {
    const early = waveFrontState({ ...base, simTime: 0.05 })
    expect(early.frontActive).toBe(false)

    const after = waveFrontState({ ...base, simTime: early.genTime + 0.5 })
    expect(after.frontActive).toBe(true)
    expect(after.frontX).toBeGreaterThan(base.portalIn + 10)
  })
})
