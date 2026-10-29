# 04 — Gráficos y efectos

## Confirmado (REA + chunk público `_nuxt/aaa3fb1.js`)

| Tecnología | Rol en live | Local |
|---|---|---|
| WebGL2 | Contexto de `monopo-gradient` CE | `createMonopoGradient` WebGL2 |
| GLSL ES 3.0 fullscreen triangle | Fragment con bandas + ruido | `monopoGradientShader.ts` |
| IQ `gradientDerivativesNoise3D` (MIT) | Displacement orgánico | Misma licencia / port |
| PixiJS 6.2.0 | `c-PixiApp` / intro / image FX | **No portado 1:1**; intro tipográfica Vue |
| Lenis | Smooth scroll | `lenis` en layout |
| Nuxt estático + Prismic | CMS | Content JSON + Nuxt 4 |

## Params hero home (CMS markup)

`color1=#16254b` `color2=#23418a` `color3=#aadfd9` `color4=#e64f0f`  
`displacement=4.66` `zoom=0.72` `spacing=4.27` `seed=-0.06` …

## Fix aplicado tras re-inspección local

Síntoma: canvas negro pese a contexto WebGL2 válido.

Alineación con CE original (chunk):

- `preserveDrawingBuffer: true`, `antialias: true`, `depth: true`
- `viewportSize` = tamaño CSS (no solo buffer)
- `gl.clear(COLOR|DEPTH)` antes de `draw`
- Guards `isnan` en displacement / grain

**Confirmado post-fix:** `readPixels` colores no negros; screenshot con bandas orgánicas.

## No confirmado como dependencia del hero

- Three.js / R3F: no en live; `three` instalado localmente pero **no** usado en el hero.
- GSAP: probable en tipografía/scroll; usado localmente en `useReveal`.
