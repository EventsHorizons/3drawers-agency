# 03 — Evidencia visual

## Live `https://monopo.london/` (REA + browser)

| Observación | Clasificación | Evidencia |
|---|---|---|
| Splash inicial negro `monopo \| london` | Confirmado | Screenshot IDE browser (splash) |
| Canvas accesible + custom element gradient | Confirmado | REA a11y role Canvas; DOM `MONOPO-GRADIENT` |
| PixiJS 6.2.0 + WebGL 2 banner en consola | Confirmado | `inspect_web_page` console text_capture |
| Recent work + featured projects | Confirmado | Scenario + snapshot a11y |
| Clocks LON/TKY/NYC en nav | Confirmado | Snapshot live |

## Local `http://localhost:3010/` (post-fix)

| Observación | Clasificación | Evidencia |
|---|---|---|
| Intro centrada: 3 líneas manifesto + 3 foot columns | Confirmado | Screenshot `?rea=1` + a11y names |
| WebGL gradient navy/teal/naranja con grain | Confirmado | `readPixels` center≈`[77,113,162]`; screenshot work phase |
| Botón Pause background | Confirmado | a11y + UI |
| Banner DEV RECONSTRUCTION | Confirmado | Layout |
| Foot columns apiladas en viewport estrecho IDE | Confirmado | CSS `@media (min-width: 800px)` → 3 cols |

## Gaps residuales (Pendiente / Probable)

| Gap | Clasificación |
|---|---|
| Paridad 1:1 Pixi intro letter-spacing / staggered reveal | Pendiente |
| Distorsión Pixi en covers de proyecto | Pendiente |
| Transición de página `c-AppTransition` | Pendiente |
| Clocks multi-ciudad en header local | Pendiente (footer/sí; header no idéntico) |
