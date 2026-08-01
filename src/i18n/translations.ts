export type Lang = 'en' | 'fr'

export type Highlight = 'blockage' | 'mach' | 'pressure' | 'rise' | 'boom'

type Dict = {
  brandTitle: string
  brandSub: string
  langLabel: string
  modeAria: string
  modes: {
    explore: string
    derive: string
    mitigate: string
    lab: string
  }
  tunnelStage: string
  tunnelStageMeta: string
  play: string
  pause: string
  reset: string
  exportCsv: string
  scrubAria: string
  stageHint: string
  parameters: string
  live: string
  mitigationActive: string
  trainSpeed: string
  blockage: string
  noseLength: string
  tunnelLength: string
  ambientTemp: string
  hoodLength: string
  riseTime: string
  boomIndex: string
  extPeak: string
  mitigateHint: string
  labPrompt: string
  labHint: string
  formulaBoard: string
  liveValues: string
  derivationPath: string
  deriveSteps: string[]
  assumptions: string[]
  equations: Record<Highlight, { title: string; note: string }>
  waveforms: string
  interiorP: string
  portalGradient: string
  exteriorMp: string
  solidCurrent: string
  ghostBaseline: string
  entry: string
  exit: string
  waveFront: string
  portalMic: string
  stageAria: string
}

export const translations: Record<Lang, Dict> = {
  en: {
    brandTitle: 'PISTON EFFECT LAB',
    brandSub:
      'Graduate teaching instrument for train–tunnel compression waves, portal micro-pressure, and the physics behind tunnel boom.',
    langLabel: 'Language',
    modeAria: 'Lab mode',
    modes: {
      explore: 'Explore',
      derive: 'Derive',
      mitigate: 'Mitigate',
      lab: 'Lab',
    },
    tunnelStage: 'Tunnel stage',
    tunnelStageMeta: 'side section · acoustic front',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    exportCsv: 'Export CSV',
    scrubAria: 'Scrub simulation time',
    stageHint:
      'Hatch density marks compressed air ahead of the nose. The amber probe tracks the compression front at sound speed; the portal mic marks where ∂p/∂t radiates as a micro-pressure wave.',
    parameters: 'Parameters',
    live: 'live',
    mitigationActive: 'mitigation active',
    trainSpeed: 'Train speed',
    blockage: 'Blockage β',
    noseLength: 'Nose length',
    tunnelLength: 'Tunnel length',
    ambientTemp: 'Ambient temperature',
    hoodLength: 'Entry hood length',
    riseTime: 'Rise time',
    boomIndex: 'Boom index',
    extPeak: 'Ext. peak',
    mitigateHint:
      'Mitigation mode: increase nose length or hood length and watch boom index fall faster than interior Δp. That is the portal-gradient lesson.',
    labPrompt: 'Lab prompt',
    labHint:
      'Hold β = 0.25. Find the lowest speed that yields boom index ≥ 1.0 with no hood, then add a hood that brings it back below 0.7. Export your parameter set in a lab note (V, L_nose, L_hood, Δp, t_r).',
    formulaBoard: 'Formula board',
    liveValues: 'Live values:',
    derivationPath: 'Derivation path',
    deriveSteps: [
      'Treat the train nose as a moving constriction that displaces tunnel air.',
      'Match mass flux through the annular gap → pressure rise scales with β/(1−β)².',
      'Non-dimensionalize with M² from unsteady Bernoulli / acoustic scaling.',
      'Propagate the compression front at ≈ c; radiate when it reaches the exit portal.',
      'Exterior amplitude follows the emitted ∂p/∂t (and portal diffraction, omitted here).',
    ],
    assumptions: [
      'Quasi-1D inviscid air column; constant γ, R.',
      'Single-track circular/equivalent section; no shafts or cross-passages.',
      'Boom index is a classroom proxy — not a certified dB(A) prediction.',
    ],
    equations: {
      blockage: {
        title: 'Blockage ratio',
        note: 'Fraction of the tunnel section occluded by the train. Strongest geometric driver of the piston compression.',
      },
      mach: {
        title: 'Train Mach number',
        note: 'Couples operating speed to the acoustic propagation speed of the compression wave ahead of the nose.',
      },
      pressure: {
        title: 'Entry pressure rise (teaching form)',
        note: 'Idealized inviscid piston limit. Real tunnels add friction, leakage, and 3-D nose/portal effects.',
      },
      rise: {
        title: 'Pressure rise time',
        note: 'Slower rise (longer nose or hood) reduces portal ∂p/∂t and the radiated micro-pressure wave.',
      },
      boom: {
        title: 'Portal radiation proxy',
        note: 'The audible/measurable tunnel boom tracks the temporal gradient at emission more than the steady interior Δp alone.',
      },
    },
    waveforms: 'Waveforms',
    interiorP: 'Interior p(t)',
    portalGradient: 'Portal ∂p/∂t',
    exteriorMp: 'Exterior micro-pressure',
    solidCurrent: 'solid = current',
    ghostBaseline: 'ghost = baseline (no hood, short nose)',
    entry: 'ENTRY',
    exit: 'EXIT',
    waveFront: 'wave front → c',
    portalMic: 'portal mic',
    stageAria: 'Train entering tunnel with compression wave front',
  },
  fr: {
    brandTitle: 'LABO EFFET PISTON',
    brandSub:
      'Instrument pédagogique de niveau master pour les ondes de compression train–tunnel, la micro-pression au portail et la physique du bang de tunnel.',
    langLabel: 'Langue',
    modeAria: 'Mode du laboratoire',
    modes: {
      explore: 'Explorer',
      derive: 'Dériver',
      mitigate: 'Atténuer',
      lab: 'TP',
    },
    tunnelStage: 'Scène tunnel',
    tunnelStageMeta: 'coupe · front acoustique',
    play: 'Lecture',
    pause: 'Pause',
    reset: 'Réinit.',
    exportCsv: 'Exporter CSV',
    scrubAria: 'Défiler le temps de simulation',
    stageHint:
      'Le hachurage indique l’air comprimé devant le nez. La sonde ambre suit le front de compression à la vitesse du son ; le micro portail marque où ∂p/∂t rayonne en micro-pression.',
    parameters: 'Paramètres',
    live: 'temps réel',
    mitigationActive: 'atténuation active',
    trainSpeed: 'Vitesse du train',
    blockage: 'Blocage β',
    noseLength: 'Longueur du nez',
    tunnelLength: 'Longueur du tunnel',
    ambientTemp: 'Température ambiante',
    hoodLength: 'Longueur du capot d’entrée',
    riseTime: 'Temps de montée',
    boomIndex: 'Indice de bang',
    extPeak: 'Pic ext.',
    mitigateHint:
      'Mode atténuation : allongez le nez ou le capot et observez l’indice de bang diminuer plus vite que Δp intérieur. C’est la leçon du gradient au portail.',
    labPrompt: 'Consigne de TP',
    labHint:
      'Fixez β = 0,25. Trouvez la plus faible vitesse donnant un indice de bang ≥ 1,0 sans capot, puis ajoutez un capot qui le ramène sous 0,7. Exportez votre jeu de paramètres (V, L_nez, L_capot, Δp, t_r).',
    formulaBoard: 'Tableau des formules',
    liveValues: 'Valeurs live :',
    derivationPath: 'Chemin de dérivation',
    deriveSteps: [
      'Traiter le nez du train comme une constriction mobile qui déplace l’air du tunnel.',
      'Égaliser le flux massique dans l’entrefer annulaire → la hausse de pression scale en β/(1−β)².',
      'Adimensionner avec M² via Bernoulli instationnaire / échelle acoustique.',
      'Propager le front de compression à ≈ c ; rayonner à l’arrivée au portail de sortie.',
      'L’amplitude extérieure suit le ∂p/∂t émis (diffraction 3D du portail omise ici).',
    ],
    assumptions: [
      'Colonne d’air quasi-1D inviscide ; γ et R constants.',
      'Section circulaire/équivalente voie unique ; pas de puits ni galeries.',
      'L’indice de bang est un proxy pédagogique — pas une prédiction dB(A) certifiée.',
    ],
    equations: {
      blockage: {
        title: 'Taux de blocage',
        note: 'Fraction de la section du tunnel occupée par le train. Principal levier géométrique de la compression piston.',
      },
      mach: {
        title: 'Nombre de Mach du train',
        note: 'Couple la vitesse d’exploitation à la célérité acoustique de l’onde de compression devant le nez.',
      },
      pressure: {
        title: 'Hausse de pression à l’entrée (forme pédagogique)',
        note: 'Limite piston inviscide idéalisée. Les tunnels réels ajoutent frottement, fuites et effets 3D nez/portail.',
      },
      rise: {
        title: 'Temps de montée en pression',
        note: 'Une montée plus lente (nez ou capot plus long) réduit ∂p/∂t au portail et l’onde de micro-pression rayonnée.',
      },
      boom: {
        title: 'Proxy de rayonnement au portail',
        note: 'Le bang mesurable/audible suit surtout le gradient temporel à l’émission, plus que le seul Δp intérieur stationnaire.',
      },
    },
    waveforms: 'Formes d’onde',
    interiorP: 'Intérieur p(t)',
    portalGradient: 'Portail ∂p/∂t',
    exteriorMp: 'Micro-pression extérieure',
    solidCurrent: 'plein = courant',
    ghostBaseline: 'fantôme = référence (sans capot, nez court)',
    entry: 'ENTRÉE',
    exit: 'SORTIE',
    waveFront: 'front d’onde → c',
    portalMic: 'micro portail',
    stageAria: 'Train entrant dans un tunnel avec front d’onde de compression',
  },
}

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('edu-piston-lang')
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('fr')) {
    return 'fr'
  }
  return 'en'
}
