import { useMemo } from 'react'
import type { WaveSample } from '../physics/types'

interface Props {
  samples: WaveSample[]
  progress: number
  duration: number
  compareSamples?: WaveSample[] | null
}

function pathFrom(
  samples: WaveSample[],
  pick: (s: WaveSample) => number,
  width: number,
  height: number,
): string {
  if (samples.length === 0) return ''
  const values = samples.map(pick)
  const max = Math.max(...values.map(Math.abs), 1e-9)
  const pad = 8
  return samples
    .map((s, i) => {
      const x = pad + (i / (samples.length - 1)) * (width - pad * 2)
      const y = height / 2 - (pick(s) / max) * (height / 2 - pad)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function WavePlot({
  title,
  samples,
  pick,
  progress,
  compareSamples,
}: {
  title: string
  samples: WaveSample[]
  pick: (s: WaveSample) => number
  progress: number
  compareSamples?: WaveSample[] | null
}) {
  const W = 320
  const H = 140
  const main = useMemo(() => pathFrom(samples, pick, W, H), [samples, pick])
  const ghost = useMemo(
    () => (compareSamples ? pathFrom(compareSamples, pick, W, H) : ''),
    [compareSamples, pick],
  )
  const cursorX = 8 + progress * (W - 16)

  return (
    <div className="wave-card">
      <h3>{title}</h3>
      <svg className="wave-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <line x1="8" y1={H / 2} x2={W - 8} y2={H / 2} stroke="rgba(255,255,255,0.12)" />
        <line x1="8" y1="8" x2="8" y2={H - 8} stroke="rgba(255,255,255,0.12)" />
        {ghost && <path d={ghost} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.25" />}
        <path d={main} fill="none" stroke="#f2f2f2" strokeWidth="1.6" />
        <line x1={cursorX} y1="6" x2={cursorX} y2={H - 6} stroke="#d4a017" strokeWidth="1.25" />
      </svg>
    </div>
  )
}

export function WaveformPanel({ samples, progress, duration, compareSamples }: Props) {
  return (
    <div className="panel waveforms">
      <div className="panel-header">
        <span>Waveforms</span>
        <span>t = {(progress * duration).toFixed(2)} s / {duration.toFixed(2)} s</span>
      </div>
      <div className="panel-body">
        <div className="wave-grid">
          <WavePlot
            title="Interior p(t)"
            samples={samples}
            pick={(s) => s.interior}
            progress={progress}
            compareSamples={compareSamples}
          />
          <WavePlot
            title="Portal ∂p/∂t"
            samples={samples}
            pick={(s) => s.portalGradient}
            progress={progress}
            compareSamples={compareSamples}
          />
          <WavePlot
            title="Exterior micro-pressure"
            samples={samples}
            pick={(s) => s.exterior}
            progress={progress}
            compareSamples={compareSamples}
          />
        </div>
        {compareSamples && (
          <div className="compare-row">
            <span className="chip">solid = current</span>
            <span className="chip">ghost = baseline (no hood, short nose)</span>
          </div>
        )}
      </div>
    </div>
  )
}
