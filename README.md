# monopo.london — reconstrucción local (dev)

Reconstrucción Nuxt 4 del sitio [monopo.london](https://monopo.london/) a partir de evidencia observable (browser MCP, payloads Nuxt, API pública Prismic).

**No es el sitio oficial.** Uso previsto: entorno de desarrollo autorizado.

## Arranque

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview: `npm run preview`

## Rutas

`/`, `/work`, `/work/[uid]` (×34), `/services`, `/team`, `/team/[uid]` (×11), `/contact`, `/press`, `/policy`

## Datos

- `content/*.json` generados desde Prismic (`research/fetch-prismic.mjs`, `research/normalize-content.mjs`)
- Fuentes: `public/fonts` (Roobert / Noto CJK servidas públicamente en el origen)

## Docs

- `docs/FINAL-REPORT.md` — informe de entrega
- `docs/FINAL-REPORT-V2-GRAPHICS.md` — WebGL / monopo-gradient / shaders
- `docs/route-inventory.md`
- `docs/limitations.md`
