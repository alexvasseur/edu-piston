# PISTON EFFECT LAB (`edu-piston`)

Graduate teaching instrument for the **train–tunnel piston effect**: compression waves, portal micro-pressure waves (MPW), and the physics behind tunnel boom.

Black-and-white, instrumentation-style UI with live parameters, formula board (KaTeX), synchronized tunnel animation, and exportable waveforms.

## Run locally

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm test` | Physics model unit tests (Vitest) |
| `npm run lint` | Oxlint |

## Teaching model (transparent approximations)

- Blockage \(\beta = A_\mathrm{train}/A_\mathrm{tunnel}\)
- Mach \(M = V/c\) with \(c=\sqrt{\gamma R T}\)
- Entry pressure rise (inviscid piston teaching form):

  \[
  \frac{\Delta p}{p_0} \approx \frac{\gamma M^2 \beta}{(1-\beta)^2}
  \]

- Rise time \(t_r \sim (L_\mathrm{nose} + 0.65 L_\mathrm{hood})/V\)
- Exterior micro-pressure scales with portal \(\partial p/\partial t\)
- **Boom index** is a classroom loudness proxy, not a certified dB prediction

Assumptions are listed in the Formula board: quasi-1D inviscid air column, no shafts/cross-passages, constant \(\gamma, R\).

## Modes

1. **Explore** — free sliders, animation, waveforms  
2. **Derive** — same scene with derivation steps  
3. **Mitigate** — hood / nose length vs boom; ghost baseline traces  
4. **Lab** — prescribed graduate exercise  

## License

MIT
