import { useEffect, useMemo, useRef, useState } from 'react'
import { FormulaBoard } from './components/FormulaBoard'
import { ParameterPanel } from './components/ParameterPanel'
import { TunnelStage } from './components/TunnelStage'
import { WaveformPanel } from './components/WaveformPanel'
import { DEFAULT_PARAMS } from './physics/constants'
import { simulate } from './physics/model'
import type { LabMode, SimulationParams } from './physics/types'

type Highlight = 'blockage' | 'mach' | 'pressure' | 'rise' | 'boom'

const MODES: { id: LabMode; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'derive', label: 'Derive' },
  { id: 'mitigate', label: 'Mitigate' },
  { id: 'lab', label: 'Lab' },
]

export default function App() {
  const [mode, setMode] = useState<LabMode>('explore')
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS)
  const [highlight, setHighlight] = useState<Highlight>('pressure')
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(true)
  const raf = useRef<number | null>(null)
  const last = useRef<number | null>(null)

  const result = useMemo(() => simulate(params), [params])

  const baseline = useMemo(() => {
    if (mode !== 'mitigate') return null
    return simulate({
      ...params,
      hoodLength: 0,
      noseLength: Math.min(params.noseLength, 6),
    })
  }, [mode, params])

  useEffect(() => {
    if (!playing) {
      last.current = null
      return
    }
    const tick = (now: number) => {
      if (last.current == null) last.current = now
      const dt = (now - last.current) / 1000
      last.current = now
      setProgress((p) => {
        const next = p + dt / result.duration
        return next >= 1 ? 0 : next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [playing, result.duration])

  const patchParams = (patch: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...patch }))
  }

  const exportCsv = () => {
    const header = 't_s,interior_Pa,portal_gradient_Pa_s,exterior_Pa\n'
    const body = result.samples
      .map(
        (s) =>
          `${s.t.toFixed(5)},${s.interior.toFixed(4)},${s.portalGradient.toFixed(4)},${s.exterior.toFixed(6)}`,
      )
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edu-piston-waveforms.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1 className="brand-mark">PISTON EFFECT LAB</h1>
          <p className="brand-sub">
            Graduate teaching instrument for train–tunnel compression waves, portal micro-pressure,
            and the physics behind tunnel boom.
          </p>
        </div>
        <div className="mode-tabs" role="tablist" aria-label="Lab mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={mode === m.id ? 'active' : ''}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="layout">
        <section className="panel">
          <div className="panel-header">
            <span>Tunnel stage</span>
            <span>side section · acoustic front</span>
          </div>
          <div className="panel-body">
            <TunnelStage
              params={params}
              derived={result.derived}
              progress={progress}
              duration={result.duration}
            />
            <div className="transport">
              <button type="button" onClick={() => setPlaying((p) => !p)}>
                {playing ? 'Pause' : 'Play'}
              </button>
              <button type="button" className="secondary" onClick={() => setProgress(0)}>
                Reset
              </button>
              <button type="button" className="secondary" onClick={exportCsv}>
                Export CSV
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                aria-label="Scrub simulation time"
                onChange={(e) => {
                  setPlaying(false)
                  setProgress(Number(e.target.value))
                }}
              />
            </div>
            <p className="hint">
              Hatch density marks compressed air ahead of the nose. The amber probe tracks the
              compression front at sound speed; the portal mic marks where ∂p/∂t radiates as a
              micro-pressure wave.
            </p>
          </div>
        </section>

        <aside style={{ display: 'grid', gap: '1rem' }}>
          <ParameterPanel
            mode={mode}
            params={params}
            derived={result.derived}
            onChange={patchParams}
            onHighlight={setHighlight}
          />
          <FormulaBoard mode={mode} derived={result.derived} highlight={highlight} />
        </aside>
      </div>

      <WaveformPanel
        samples={result.samples}
        progress={progress}
        duration={result.duration}
        compareSamples={baseline?.samples}
      />
    </div>
  )
}
