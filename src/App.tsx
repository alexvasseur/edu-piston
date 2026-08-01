import { useEffect, useMemo, useRef, useState } from 'react'
import { FormulaBoard } from './components/FormulaBoard'
import { LanguageSelector } from './components/LanguageSelector'
import { ParameterPanel } from './components/ParameterPanel'
import { TunnelStage } from './components/TunnelStage'
import { WaveformPanel } from './components/WaveformPanel'
import { useLanguage } from './i18n/LanguageContext'
import type { Highlight } from './i18n/translations'
import { DEFAULT_PARAMS } from './physics/constants'
import { simulate } from './physics/model'
import type { LabMode, SimulationParams } from './physics/types'

const MODE_IDS: LabMode[] = ['explore', 'derive', 'mitigate', 'lab']

export default function App() {
  const { t } = useLanguage()
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
          <h1 className="brand-mark">{t.brandTitle}</h1>
          <p className="brand-sub">{t.brandSub}</p>
        </div>
        <div className="topbar-controls">
          <LanguageSelector />
          <div className="mode-tabs" role="tablist" aria-label={t.modeAria}>
            {MODE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                className={mode === id ? 'active' : ''}
                onClick={() => setMode(id)}
              >
                {t.modes[id]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="layout">
        <div className="stage-column">
          <section className="panel">
            <div className="panel-header">
              <span>{t.tunnelStage}</span>
              <span>{t.tunnelStageMeta}</span>
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
                  {playing ? t.pause : t.play}
                </button>
                <button type="button" className="secondary" onClick={() => setProgress(0)}>
                  {t.reset}
                </button>
                <button type="button" className="secondary" onClick={exportCsv}>
                  {t.exportCsv}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={progress}
                  aria-label={t.scrubAria}
                  onChange={(e) => {
                    setPlaying(false)
                    setProgress(Number(e.target.value))
                  }}
                />
              </div>
              <p className="hint">{t.stageHint}</p>
            </div>
          </section>

          <WaveformPanel
            nested
            samples={result.samples}
            progress={progress}
            duration={result.duration}
            compareSamples={baseline?.samples}
          />
        </div>

        <aside className="side-column">
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
    </div>
  )
}
