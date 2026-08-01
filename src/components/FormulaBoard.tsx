import katex from 'katex'
import { useLanguage } from '../i18n/LanguageContext'
import type { Highlight } from '../i18n/translations'
import type { DerivedQuantities, LabMode } from '../physics/types'

function MathBlock({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
  })
  return <div className="eq" dangerouslySetInnerHTML={{ __html: html }} />
}

const EQUATION_TEX: Record<Highlight, string> = {
  blockage: String.raw`\beta = \dfrac{A_{\mathrm{train}}}{A_{\mathrm{tunnel}}}`,
  mach: String.raw`M = \dfrac{V}{c},\quad c=\sqrt{\gamma R T}`,
  pressure: String.raw`\dfrac{\Delta p}{p_0} \approx \dfrac{\gamma M^{2}\beta}{(1-\beta)^{2}}`,
  rise: String.raw`t_r \sim \dfrac{L_{\mathrm{nose}} + 0.65\,L_{\mathrm{hood}}}{V}`,
  boom: String.raw`\Delta p_{\mathrm{ext}} \propto \left.\dfrac{\partial p}{\partial t}\right|_{\mathrm{portal}}`,
}

interface Props {
  mode: LabMode
  derived: DerivedQuantities
  highlight: Highlight
}

export function FormulaBoard({ mode, derived, highlight }: Props) {
  const { t } = useLanguage()
  const eq = t.equations[highlight]

  return (
    <div className="panel formula-board">
      <div className="panel-header">
        <span>{t.formulaBoard}</span>
        <span>{eq.title}</span>
      </div>
      <div className="panel-body">
        <MathBlock tex={EQUATION_TEX[highlight]} />
        <p>{eq.note}</p>
        <p>
          {t.liveValues}{' '}
          <strong>β = {derived.blockage.toFixed(3)}</strong>
          {' · '}
          <strong>M = {derived.mach.toFixed(3)}</strong>
          {' · '}
          <strong>Δp = {(derived.deltaP / 1000).toFixed(2)} kPa</strong>
          {' · '}
          <strong>
            t<sub>r</sub> = {(derived.riseTime * 1000).toFixed(0)} ms
          </strong>
        </p>

        {mode === 'derive' && (
          <div className="derive-steps">
            <strong>{t.derivationPath}</strong>
            <ol>
              {t.deriveSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <ul className="assumptions">
          {t.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
