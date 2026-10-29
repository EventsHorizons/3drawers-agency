# 02 — Mapa de páginas Monopo London

**Fuentes:** REA `inspect_web_page` + `capture_browser_scenario` + `analyze_web_bundle` + payloads Prismic `monopolondon`.  
**Clasificación por fila** en columna Estado.

| Ruta live | Tipo | Local | Estado |
|---|---|---|---|
| `/` | Home: splash → PixiIntro → recent work | `/` intro tipográfico + WebGL `MonopoGradient` → recent work | Confirmado / reconstruido |
| `/work/` | Portfolio + filtros | `/work` | Confirmado |
| `/work/:uid` | Case study ×34 | `/work/[uid]` ×34 | Confirmado |
| `/services/` | Servicios | `/services` | Confirmado |
| `/team/` | Equipo | `/team` | Confirmado |
| `/team/:uid` | Ficha ×11 | `/team/[uid]` ×11 | Confirmado |
| `/contact/` | Contacto + form | `/contact` | Confirmado (envío demo honesto) |
| `/press/` | Press & news | `/press` | Confirmado |
| `/policy/` | Cookie / privacy | `/policy` | Confirmado |
| `/preview` | Prismic Preview | **No implementado** | Confirmado CMS-only; fuera de alcance marketing |

## Navegación observada (scenario REA)

1. `goto` `https://monopo.london/`  
2. `goto` `https://monopo.london/work/`  
3. `goto` `https://monopo.london/team/`  
4. `goto` `https://monopo.london/press/`  

Todas `status: completed`. Artefacto: `research/rea-captures/scenario-nav-raw.json`.

## Diferencias de plantilla (Confirmado)

- Home: capa Pixi + `monopo-gradient` a pantalla completa; intro tipográfica centrada antes del sticky recent-work.
- Work/Services/Team/Policy: heroes con `monopo-gradient` y params CMS distintos.
- Work detail / Team detail / Contact / Press: sin el mismo hero gradient fullscreen (composiciones propias).
