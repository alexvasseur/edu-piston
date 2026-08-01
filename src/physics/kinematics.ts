/**
 * Visual stage kinematics: train tip follows true speed V,
 * while the compression front follows sound speed c after entry.
 */

export const APPROACH_METERS = 55
export const EXIT_METERS = 40

export interface TrainTipInput {
  simTime: number
  speedMs: number
  tunnelLength: number
  portalIn: number
  portalOut: number
  /** Approach distance shown before the entry portal (m). */
  approachMeters?: number
  /** Extra run-out past the exit portal (m). */
  exitMeters?: number
}

export function trainEntryTime(speedMs: number, approachMeters = APPROACH_METERS): number {
  return approachMeters / Math.max(speedMs, 0.1)
}

export function trainTipX({
  simTime,
  speedMs,
  tunnelLength,
  portalIn,
  portalOut,
  approachMeters = APPROACH_METERS,
  exitMeters = EXIT_METERS,
}: TrainTipInput): number {
  const tunnelLenPx = portalOut - portalIn
  const pxPerMeter = tunnelLenPx / Math.max(tunnelLength, 1)
  const tipStart = portalIn - approachMeters * pxPerMeter
  const tipEnd = portalOut + exitMeters * pxPerMeter
  const distanceM = Math.max(0, speedMs) * Math.max(0, simTime)
  const tipX = tipStart + distanceM * pxPerMeter
  return Math.min(tipEnd, tipX)
}

export interface WaveFrontInput {
  simTime: number
  speedMs: number
  soundSpeed: number
  tunnelLength: number
  portalIn: number
  portalOut: number
  /** Nose entry duration (s); front leaves near mid-entry after the tip reaches the portal. */
  entryDuration: number
  approachMeters?: number
}

/**
 * Compression front starts only once the nose tip reaches the entry portal,
 * then propagates at sound speed. Previously it used entryDuration from t=0
 * and appeared during the approach phase.
 */
export function waveFrontState({
  simTime,
  speedMs,
  soundSpeed,
  tunnelLength,
  portalIn,
  portalOut,
  entryDuration,
  approachMeters = APPROACH_METERS,
}: WaveFrontInput): { frontX: number; frontActive: boolean; genTime: number } {
  const tEnter = trainEntryTime(speedMs, approachMeters)
  // Launch as the nose is entering (after tip arrives), not before the portal.
  const genTime = tEnter + 0.45 * Math.max(entryDuration, 0)
  const tunnelLenPx = Math.max(portalOut - portalIn, 1)
  const pxPerMeter = tunnelLenPx / Math.max(tunnelLength, 1)

  if (simTime < genTime) {
    return { frontX: portalIn, frontActive: false, genTime }
  }

  const distM = Math.max(0, soundSpeed) * (simTime - genTime)
  const frontX = portalIn + Math.min(tunnelLenPx, distM * pxPerMeter)
  const frontActive = distM * pxPerMeter <= tunnelLenPx * 1.02
  return { frontX, frontActive, genTime }
}
