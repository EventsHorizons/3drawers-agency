# Informe final — reconstrucción monopo.london

## 1. Arquitectura

Nuxt 4.6 (app/), Vue 3, Lenis (smooth scroll), GSAP instalado, canvas 2D aurora en home. Contenido normalizado desde API pública Prismic (`content/*.json`). Layout global: header overlay, footer, cookies. Rutas file-based en `app/pages`.

## 2. Rutas reconstruidas

| Ruta local | Origen |
|---|---|
| `/` | `https://monopo.london/` |
| `/work` | `/work/` |
| `/work/[uid]` ×34 | fichas de proyecto |
| `/services` | `/services/` |
| `/team` | `/team/` |
| `/team/[uid]` ×11 | fichas de equipo |
| `/contact` | `/contact/` |
| `/press` | `/press/` |
| `/policy` | `/policy/` |

## 3. Fichas de proyecto

**34/34** UIDs desde Prismic, con cover, categorías, meta (client/roles/deliverables/date), intro split, slices de cuerpo y related.

## 4. Componentes y animaciones

- `AppHeader` (menú overlay + relojes Londres/Tokio/NYC)
- `AppFooter`, `AppCookies` (persistencia localStorage)
- `AuroraCanvas` + intro splash (aprox. Pixi)
- `ProjectFilters` / `ProjectGrid` / `ProjectSlices`
- Transiciones CSS fade intro; Lenis para scroll

## 5. Herramientas usadas de verdad

- Browser MCP (navegación + snapshots localhost)
- API Prismic pública + scripts `research/fetch-prismic.mjs`, `normalize-content.mjs`
- REA CLI vía npx (help/setup); **MCP REA/Eigent no autenticaron**
- `npm run build` (OK)

## 6. Pruebas

- Build producción: **OK** (~23s)
- Home: categorías CMS correctas (SPATIAL, Brand design…)
- Work: filtros (p.ej. SPATIAL → 7 proyectos), All count = 34
- Team: narrativa completa CMS (founders, places, community, studio, jobs)
- Case study nkora: meta + slices + related
- Contact: validación; aviso demo sin backend
- Cookies: Accept + link policy

## 7. Errores corregidos

- Paths Nuxt 4 `~~/content` (no `~/content`)
- Mapeo categorías UID → nombre CMS (work + press)
- `rich()` acepta strings planos (news categories)
- Meta de proyecto: roles/deliverables como labels; intro left/right
- Contador All del portafolio (era suma de tags, ahora nº de proyectos)

## 8. No reproducido / pendiente

Ver `docs/limitations.md`: Pixi WebGL exacto, envío de formulario, transiciones de página frame-a-frame, QA captura móvil/tableta exhaustivo, chunk size.

## 9. Diferencias visuales pendientes

- Aurora ≠ shader Pixi original
- Tipografía/espaciado de algunas secciones editoriales aún no pixel-perfect vs origen
- Cursor/hover custom del origen ausente
- Home featured list tipográfica vs grid/media del origen en scroll profundo puede diferir

## 10. Arranque local

```bash
npm install
npm run dev -- --port 3010
# o
npm run build && node .output/server/index.mjs
```

Regenerar CMS: `node research/fetch-prismic.mjs` luego `node research/normalize-content.mjs`.
