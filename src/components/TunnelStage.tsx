import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import type { DerivedQuantities, SimulationParams } from '../physics/types'

interface Props {
  params: SimulationParams
  derived: DerivedQuantities
  progress: number
  duration: number
}

export function TunnelStage({ params, derived, progress, duration }: Props) {
  const { t } = useLanguage()
  const simTime = progress * duration
  const geometry = useMemo(() => {
    const W = 920
    const H = 280
    const tunnelY = 110
    const tunnelH = 70
    const portalIn = 120
    const portalOut = 800
    const tunnelLenPx = portalOut - portalIn
    const trainLen = 150
    const nosePx = Math.max(18, (params.noseLength / params.tunnelLength) * tunnelLenPx * 4)
    const hoodPx = params.hoodLength > 0 ? Math.min(90, params.hoodLength * 0.9) : 0

    // Continuous constant-speed tip motion (local x=0 is the nose tip).
    // Piecewise phases previously mismatched at the portal and caused a ~90px jump.
    const approachDist = 110
    const exitDist = 90
    const tipStart = portalIn - approachDist
    const tipEnd = portalOut + exitDist
    const tipTravel = tipEnd - tipStart
    const moveUntil = 0.9 // final 10% holds at the exit side
    const uMove = Math.min(1, Math.max(0, progress / moveUntil))
    const trainX = tipStart + uMove * tipTravel

    // Compression front travels at sound speed after generation.
    const genTime = derived.entryDuration * 0.55
    const frontT = Math.max(0, simTime - genTime)
    const frontFrac = Math.min(1, frontT / Math.max(derived.transitTime, 1e-3))
    const frontX = portalIn + frontFrac * tunnelLenPx
    const frontActive = simTime >= genTime * 0.3 && frontFrac < 1.02

    // Pressure hatch opacity inside tunnel ahead of train.
    const pressureAlpha = Math.min(0.55, derived.deltaPOverP0 * 8)

    return {
      W,
      H,
      tunnelY,
      tunnelH,
      portalIn,
      portalOut,
      trainLen,
      nosePx,
      hoodPx,
      trainX,
      frontX,
      frontActive,
      pressureAlpha,
    }
  }, [params, derived, progress, duration, simTime])

  const {
    W,
    H,
    tunnelY,
    tunnelH,
    portalIn,
    portalOut,
    trainLen,
    nosePx,
    hoodPx,
    trainX,
    frontX,
    frontActive,
    pressureAlpha,
  } = geometry

  const trainY = tunnelY + 12
  const trainH = tunnelH - 24

  return (
    <div className="stage-wrap">
      <svg
        className="stage-canvas"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t.stageAria}
      >
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          </pattern>
          <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#141414" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#ground)" />

        {/* Ground line */}
        <line x1="40" y1={tunnelY + tunnelH + 18} x2={W - 40} y2={tunnelY + tunnelH + 18} stroke="#3a3a3a" strokeWidth="1" />

        {/* Hood (optional) */}
        {hoodPx > 0 && (
          <rect
            x={portalIn - hoodPx}
            y={tunnelY - 8}
            width={hoodPx}
            height={tunnelH + 16}
            fill="none"
            stroke="#8a8a8a"
            strokeDasharray="4 3"
            strokeWidth="1.5"
          />
        )}

        {/* Tunnel tube */}
        <rect x={portalIn} y={tunnelY} width={portalOut - portalIn} height={tunnelH} fill="#151515" stroke="#d0d0d0" strokeWidth="2" />
        <rect x={portalIn} y={tunnelY} width={portalOut - portalIn} height={10} fill="#1c1c1c" />
        <rect x={portalIn} y={tunnelY + tunnelH - 10} width={portalOut - portalIn} height={10} fill="#1c1c1c" />

        {/* Compressed air hatch ahead of train inside tunnel */}
        <rect
          x={Math.min(Math.max(trainX + trainLen, portalIn), portalOut)}
          y={tunnelY + 10}
          width={Math.max(0, portalOut - Math.min(Math.max(trainX + trainLen, portalIn), portalOut))}
          height={tunnelH - 20}
          fill="url(#hatch)"
          opacity={pressureAlpha}
        />

        {/* Portals */}
        <rect x={portalIn - 6} y={tunnelY - 12} width="12" height={tunnelH + 24} fill="#f2f2f2" />
        <rect x={portalOut - 6} y={tunnelY - 12} width="12" height={tunnelH + 24} fill="#f2f2f2" />

        {/* Wave front */}
        {frontActive && (
          <g>
            <line
              x1={frontX}
              y1={tunnelY + 8}
              x2={frontX}
              y2={tunnelY + tunnelH - 8}
              stroke="#d4a017"
              strokeWidth="2"
            />
            <text x={frontX + 6} y={tunnelY - 16} fill="#d4a017" fontSize="12" fontFamily="IBM Plex Mono, monospace">
              {t.waveFront}
            </text>
          </g>
        )}

        {/* Train */}
        <g transform={`translate(${trainX}, ${trainY})`}>
          <path
            d={`M ${nosePx} 0 L ${trainLen} 0 L ${trainLen} ${trainH} L ${nosePx} ${trainH} L 0 ${trainH * 0.55} Z`}
            fill="#f2f2f2"
          />
          <rect x={nosePx + 12} y={8} width={28} height={14} fill="#0a0a0a" />
          <rect x={nosePx + 50} y={8} width={28} height={14} fill="#0a0a0a" />
        </g>

        {/* Mic markers */}
        <g>
          <circle cx={portalOut + 28} cy={tunnelY + tunnelH / 2} r="4" fill="none" stroke="#d4a017" strokeWidth="1.5" />
          <line x1={portalOut + 8} y1={tunnelY + tunnelH / 2} x2={portalOut + 24} y2={tunnelY + tunnelH / 2} stroke="#d4a017" strokeWidth="1" />
          <text x={portalOut + 36} y={tunnelY + tunnelH / 2 + 4} fill="#c8c8c8" fontSize="11" fontFamily="IBM Plex Sans, sans-serif">
            {t.portalMic}
          </text>
        </g>

        {/* Labels */}
        <text x={portalIn} y={36} fill="#8a8a8a" fontSize="12" fontFamily="IBM Plex Sans, sans-serif" letterSpacing="2">
          {t.entry}
        </text>
        <text x={portalOut - 48} y={36} fill="#8a8a8a" fontSize="12" fontFamily="IBM Plex Sans, sans-serif" letterSpacing="2">
          {t.exit}
        </text>
        <text x={40} y={H - 24} fill="#6a6a6a" fontSize="11" fontFamily="IBM Plex Mono, monospace">
          β={derived.blockage.toFixed(3)}  M={derived.mach.toFixed(3)}  L={params.tunnelLength} m
        </text>
      </svg>
    </div>
  )
}
