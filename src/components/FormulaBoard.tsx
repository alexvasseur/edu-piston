import katex from 'katex'
import type { DerivedQuantities, LabMode } from '../physics/types'

function MathBlock({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
  })
  return <div className="eq" dangerouslySetInnerHTML={{ __html: html }} />
}

interface Props {
  mode: LabMode
  derived: DerivedQuantities
  highlight: 'blockage' | 'mach' | 'pressure' | 'rise' | 'boom'
}

const EQUATIONS: Record<Props['highlight'], { title: string; tex: string; note: string }> = {
  blockage: {
    title: 'Blockage ratio',
    tex: String.raw`\beta = \dfrac{A_{\mathrm{train}}}{A_{\mathrm{tunnel}}}`,
    note: 'Fraction of the tunnel section occluded by the train. Strongest geometric driver of the piston compression.',
  },
  mach: {
    title: 'Train Mach number',
    tex: String.raw`M = \dfrac{V}{c},\quad c=\sqrt{\gamma R T}`,
    note: 'Couples operating speed to the acoustic propagation speed of the compression wave ahead of the nose.',
  },
  pressure: {
    title: 'Entry pressure rise (teaching form)',
    tex: String.raw`\dfrac{\Delta p}{p_0} \approx \dfrac{\gamma M^{2}\beta}{(1-\beta)^{2}}`,
    note: 'Idealized inviscid piston limit. Real tunnels add friction, leakage, and 3-D nose/portal effects.',
  },
  rise: {
    title: 'Pressure rise time',
    tex: String.raw`t_r \sim \dfrac{L_{\mathrm{nose}} + 0.65\,L_{\mathrm{hood}}}{V}`,
    note: 'Slower rise (longer nose or hood) reduces portal ∂p/∂t and the radiated micro-pressure wave.',
  },
  boom: {
    title: 'Portal radiation proxy',
    tex: String.raw`\Delta p_{\mathrm{ext}} \propto \left.\dfrac{\partial p}{\partial t}\right|_{\mathrm{portal}}`,
    note: 'The audible/measurable tunnel boom tracks the temporal gradient at emission more than the steady interior Δp alone.',
  },
}

export function FormulaBoard({ mode, derived, highlight }: Props) {
  const eq = EQUATIONS[highlight]

  return (
    <div className="panel formula-board">
      <div className="panel-header">
        <span>Formula board</span>
        <span>{eq.title}</span>
      </div>
      <div className="panel-body">
        <MathBlock tex={eq.tex} />
        <p>{eq.note}</p>
        <p>
          Live values:{' '}
          <strong>β = {derived.blockage.toFixed(3)}</strong>
          {' · '}
          <strong>M = {derived.mach.toFixed(3)}</strong>
          {' · '}
          <strong>Δp = {(derived.deltaP / 1000).toFixed(2)} kPa</strong>
          {' · '}
          <strong>t<sub>r</sub> = {(derived.riseTime * 1000).toFixed(0)} ms</strong>
        </p>

        {mode === 'derive' && (
          <div className="derive-steps">
            <strong>Derivation path</strong>
            <ol>
              <li>Treat the train nose as a moving constriction that displaces tunnel air.</li>
              <li>Match mass flux through the annular gap → pressure rise scales with β/(1−β)².</li>
              <li>Non-dimensionalize with M² from unsteady Bernoulli / acoustic scaling.</li>
              <li>Propagate the compression front at ≈ c; radiate when it reaches the exit portal.</li>
              <li>Exterior amplitude follows the emitted ∂p/∂t (and portal diffraction, omitted here).</li>
            </ol>
          </div>
        )}

        <ul className="assumptions">
          <li>Quasi-1D inviscid air column; constant γ, R.</li>
          <li>Single-track circular/equivalent section; no shafts or cross-passages.</li>
          <li>Boom index is a classroom proxy — not a certified dB(A) prediction.</li>
        </ul>
      </div>
    </div>
  )
}
