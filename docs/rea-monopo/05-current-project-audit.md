# 05 — Auditoría del proyecto local

**Stack:** Nuxt 4.6.3 · Vue 3 · npm · `app/` directory  
**Dev:** `npm run dev -- --port 3010` (terminal activo)  
**Git:** workspace sin `.git` en el momento de la auditoría

## Estructura relevante

| Área | Rutas reales |
|---|---|
| Páginas | `app/pages/index.vue`, `work/index.vue`, `work/[uid].vue`, `team/index.vue`, `team/[uid].vue`, `services.vue`, `contact.vue`, `press.vue`, `policy.vue` |
| Gradient | `app/components/MonopoGradient.vue`, `app/utils/createMonopoGradient.ts`, `app/utils/monopoGradientShader.ts` |
| Content | `content/*.json` (Prismic normalizado) |
| Público | `public/fonts`, `public/img` |
| Docs REA | `docs/rea-monopo/*`, capturas `research/rea-captures/*` |

## Dependencias (package.json)

`nuxt`, `vue`, `vue-router`, `lenis`, `gsap`, `@vueuse/core`, `three` (reservado; hero = WebGL2 crudo).

## Tabla de correspondencia (REA → local)

| Elemento referencia | Estado actual | Diferencia | Archivo | Acción |
|---|---|---|---|---|
| Hero gradient WebGL2 | Implementado + fix buffer | Estaba negro sin preserve/clear | `createMonopoGradient.ts`, `monopoGradientShader.ts` | Corregido |
| Intro Pixi tipográfica | Vue intro multipista | Sin Pixi letter FX | `app/pages/index.vue` | Aproximación tipográfica |
| Recent work sticky | Lista featured | OK funcional | `index.vue` | Mantener |
| Nav + menú | AppHeader | Sin clocks header | `AppHeader.vue` | Gap menor |
| Work filtros | ProjectFilters | OK | `work/index.vue` | Mantener |
| Case studies ×34 | Dinámico CMS | OK | `work/[uid].vue` | Mantener |
| Team ×11 | index + uid | OK | `team/*` | Mantener |
| Contact form | Validación local | Sin backend | `contact.vue` | Documentado |
| `/preview` | Ausente | CMS Preview | — | No implementar |
| Pixi image distort | Ausente | Gap visual work cards | — | Pendiente |
