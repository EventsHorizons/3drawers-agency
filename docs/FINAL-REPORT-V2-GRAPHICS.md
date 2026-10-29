# Informe V2 — ingeniería gráfica monopo.london

## Tecnologías detectadas (referencia)

| Tecnología | Evidencia | Certeza |
|---|---|---|
| **WebGL2** | `.c-PixiApp-canvas` getContext → WebGL 2.0 | Alta |
| **Custom element `monopo-gradient`** | CE registrado; attrs color1–4, displacement, seed, zoom… | Alta |
| **Shader GLSL ES 3.0** | Extraído de `_nuxt/aaa3fb1.js` (fragment + vertex fullscreen) | Alta |
| **Noise IQ (MIT)** | `gradientDerivativesNoise3D` + licencia Inigo Quilez en bundle | Alta |
| **PixiJS** | clases `c-Pixi*`, chunk `c906f4c.js` (PIXI/Filter) — imágenes/distorsión | Alta |
| **Lenis** | `html.lenis` | Alta |
| **Nuxt 2 estático** | `#__nuxt`, payloads `/_nuxt/static/…` | Alta |
| **GSAP** | No expuesto en window; animaciones tipográficas/scroll en chunks | Media |
| Three.js / R3F | No detectado en red/DOM | Baja (no usado) |

El hero **no** es un `linear-gradient` CSS: es un fullscreen triangle WebGL2 con bandas de color desplazadas por ruido 3D + grain 2D.

## Dependencias locales

- Ya: `gsap`, `lenis`, `@vueuse/core`, Nuxt 4 / Vue 3
- Añadido: `three@0.182.0` (disponible para distorsiones 3D futuras; el hero usa WebGL2 crudo, no Three)
- REA MCP / Eigent: auth no usable; investigación vía browser CDP + chunks públicos

## Archivos gráficos creados/modificados

| Archivo | Rol |
|---|---|
| `app/utils/monopoGradientShader.ts` | Vertex/fragment GLSL + parse CMS |
| `app/utils/createMonopoGradient.ts` | Renderer WebGL2, resize, lifecycle |
| `app/components/MonopoGradient.vue` | Integración Vue + fallback CSS + pointer |
| `app/composables/useReveal.ts` | GSAP ScrollTrigger reveals |
| `app/pages/index.vue` | Hero → MonopoGradient (params homepage) |
| `app/pages/work/index.vue` | Hero gradient works |
| `app/pages/services.vue` | Hero gradient services |
| `app/pages/team/index.vue` | Hero gradient team |
| `app/pages/policy.vue` | Hero gradient policy |
| `research/extract-shader.mjs` | Extracción de evidencia |

`AuroraCanvas.vue` (canvas 2D blobs) queda como legado no usado en home.

## Técnica por efecto

1. **Fondo hero / intros de página:** WebGL2 `MonopoGradient` con uniforms CMS (`displacement` 4.66, `zoom` 0.72, 4 colores, etc.). Redibuja estático como el CE original (play→pause); pointer opcional desplaza `position`.
2. **Grain:** `computeNoise` + `noiseIntensity` 0.04.
3. **Scroll reveals:** GSAP + ScrollTrigger en home.
4. **Smooth scroll:** Lenis (layout).
5. **Pixi image distortion / related projects:** pendiente (chunk Pixi presente en origen; no portado 1:1).

## Páginas con gradient WebGL

Home, Work, Services, Team, Policy (params Prismic por página).

## Pruebas ejecutadas

- `npm run build` → OK
- Localhost: canvas `.monopo-gradient` 779×610, botón pause presente
- Screenshot local vs live (hero) — bandas navy/teal/naranja orgánicas visibles; composición aún no pixel-perfect vs Pixi stack completo
- `prefers-reduced-motion` / visibility pause contemplados
- Fallback CSS si falla WebGL2

## Pendiente

- Distorsión Pixi de imágenes de proyecto / cursor “View case study”
- Transición `c-AppTransition` con monopo-gradient
- Paridad de intro tipográfica multipista Pixi
- QA multi-viewport captura-a-captura del shader
- Seed drift opcional (origen es mayormente estático tras 1 frame)

## Arranque

```bash
npm install
npm run dev -- --port 3010
```
