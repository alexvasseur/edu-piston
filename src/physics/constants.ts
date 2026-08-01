import type { SimulationParams } from './types'

/** Specific gas constant for dry air (J/(kg·K)) */
export const R_AIR = 287.05

/** Ratio of specific heats for air */
export const GAMMA = 1.4

/** Standard atmosphere defaults */
export const DEFAULT_PARAMS: SimulationParams = {
  speedMs: 70, // ~252 km/h
  trainArea: 10.5,
  tunnelArea: 45,
  noseLength: 8,
  tunnelLength: 800,
  temperatureK: 288.15,
  ambientPressure: 101_325,
  hoodLength: 0,
}

export const SPEED_KMH_MIN = 80
export const SPEED_KMH_MAX = 360
export const BLOCKAGE_MIN = 0.08
export const BLOCKAGE_MAX = 0.55
