/**
 * Visual stage kinematics: train tip follows true speed V,
 * while the compression front (elsewhere) follows sound speed c.
 */

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

export function trainTipX({
  simTime,
  speedMs,
  tunnelLength,
  portalIn,
  portalOut,
  approachMeters = 55,
  exitMeters = 40,
}: TrainTipInput): number {
  const tunnelLenPx = portalOut - portalIn
  const pxPerMeter = tunnelLenPx / Math.max(tunnelLength, 1)
  const tipStart = portalIn - approachMeters * pxPerMeter
  const tipEnd = portalOut + exitMeters * pxPerMeter
  const distanceM = Math.max(0, speedMs) * Math.max(0, simTime)
  const tipX = tipStart + distanceM * pxPerMeter
  return Math.min(tipEnd, tipX)
}
