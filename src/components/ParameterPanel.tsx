import { useLanguage } from '../i18n/LanguageContext'
import type { Highlight } from '../i18n/translations'
import {
  BLOCKAGE_MAX,
  BLOCKAGE_MIN,
  SPEED_KMH_MAX,
  SPEED_KMH_MIN,
} from '../physics/constants'
import { formatSci, kmhToMs, msToKmh } from '../physics/model'
import type { DerivedQuantities, LabMode, SimulationParams } from '../physics/types'

interface Props {
  mode: LabMode
  params: SimulationParams
  derived: DerivedQuantities
  onChange: (patch: Partial<SimulationParams>) => void
  onHighlight: (key: Highlight) => void
}

export function ParameterPanel({ mode, params, derived, onChange, onHighlight }: Props) {
  const { t } = useLanguage()
  const speedKmh = msToKmh(params.speedMs)
  const setSpeedKmh = (kmh: number) => onChange({ speedMs: kmhToMs(kmh) })

  const setBlockage = (beta: number) => {
    onChange({ trainArea: beta * params.tunnelArea })
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span>{t.parameters}</span>
        <span>{mode === 'mitigate' ? t.mitigationActive : t.live}</span>
      </div>
      <div className="panel-body controls">
        <label className="control" onFocus={() => onHighlight('mach')}>
          <div className="control-label">
            <span>{t.trainSpeed}</span>
            <span>{speedKmh.toFixed(0)} km/h</span>
          </div>
          <input
            type="range"
            min={SPEED_KMH_MIN}
            max={SPEED_KMH_MAX}
            step={1}
            value={speedKmh}
            onChange={(e) => {
              onHighlight('mach')
              setSpeedKmh(Number(e.target.value))
            }}
          />
        </label>

        <label className="control">
          <div className="control-label">
            <span>{t.blockage}</span>
            <span>{derived.blockage.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={BLOCKAGE_MIN}
            max={BLOCKAGE_MAX}
            step={0.005}
            value={derived.blockage}
            onChange={(e) => {
              onHighlight('blockage')
              setBlockage(Number(e.target.value))
            }}
          />
        </label>

        <label className="control">
          <div className="control-label">
            <span>{t.noseLength}</span>
            <span>{params.noseLength.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min={3}
            max={30}
            step={0.5}
            value={params.noseLength}
            onChange={(e) => {
              onHighlight('rise')
              onChange({ noseLength: Number(e.target.value) })
            }}
          />
        </label>

        <label className="control">
          <div className="control-label">
            <span>{t.tunnelLength}</span>
            <span>{params.tunnelLength.toFixed(0)} m</span>
          </div>
          <input
            type="range"
            min={200}
            max={5000}
            step={50}
            value={params.tunnelLength}
            onChange={(e) => {
              onHighlight('pressure')
              onChange({ tunnelLength: Number(e.target.value) })
            }}
          />
        </label>

        <label className="control">
          <div className="control-label">
            <span>{t.ambientTemp}</span>
            <span>{(params.temperatureK - 273.15).toFixed(0)} °C</span>
          </div>
          <input
            type="range"
            min={253}
            max={313}
            step={1}
            value={params.temperatureK}
            onChange={(e) => {
              onHighlight('mach')
              onChange({ temperatureK: Number(e.target.value) })
            }}
          />
        </label>

        <label className="control">
          <div className="control-label">
            <span>{t.hoodLength}</span>
            <span>{params.hoodLength.toFixed(0)} m</span>
          </div>
          <input
            type="range"
            min={0}
            max={80}
            step={1}
            value={params.hoodLength}
            onChange={(e) => {
              onHighlight('boom')
              onChange({ hoodLength: Number(e.target.value) })
            }}
          />
        </label>

        <div className="readouts">
          <div className="readout" onMouseEnter={() => onHighlight('mach')}>
            <span className="k">Mach M</span>
            <span className="v">{derived.mach.toFixed(3)}</span>
          </div>
          <div className="readout" onMouseEnter={() => onHighlight('pressure')}>
            <span className="k">Δp</span>
            <span className="v">{(derived.deltaP / 1000).toFixed(2)} kPa</span>
          </div>
          <div className="readout" onMouseEnter={() => onHighlight('rise')}>
            <span className="k">{t.riseTime}</span>
            <span className="v">{(derived.riseTime * 1000).toFixed(0)} ms</span>
          </div>
          <div className="readout" onMouseEnter={() => onHighlight('boom')}>
            <span className="k">{t.boomIndex}</span>
            <span className="v">{formatSci(derived.boomIndex, 3)}</span>
          </div>
          <div className="readout" onMouseEnter={() => onHighlight('boom')}>
            <span className="k">{t.extPeak}</span>
            <span className="v">{formatSci(derived.exteriorPeak, 3)} Pa</span>
          </div>
          <div className="readout" onMouseEnter={() => onHighlight('rise')}>
            <span className="k">
              f★ ~ 1/t<sub>r</sub>
            </span>
            <span className="v">{derived.characteristicFreq.toFixed(1)} Hz</span>
          </div>
        </div>

        {mode === 'mitigate' && <p className="hint">{t.mitigateHint}</p>}

        {mode === 'lab' && (
          <div className="lab-box">
            <strong>{t.labPrompt}</strong>
            <p className="hint">{t.labHint}</p>
          </div>
        )}
      </div>
    </div>
  )
}
