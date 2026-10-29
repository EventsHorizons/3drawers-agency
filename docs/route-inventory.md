# Inventario Monopo London → reconstrucción local

**Fuente:** inspección browser MCP + payloads Nuxt `_nuxt` + API pública Prismic `monopolondon` (ref `akvuMxEAAC0A2Qiu`).  
**REA MCP:** `user-rea` / `user-eigent-rea` en error (auth timeout). **REA CLI:** disponible vía npx.  
**Eigent:** MCP no usable en esta sesión.

| Ruta original | Página | Estructura (orden) | Componentes | Interacciones | Recursos | Responsive | Estado |
|---|---|---|---|---|---|---|---|
| `/` | Home | Intro splash → hero aurora → recent work → footer | Intro, AuroraCanvas, featured, cookies | Intro timed, pause aurora, menú, clocks | Prismic covers, Roobert | Desktop/móvil CSS | Implementado / verificado desktop |
| `/work/` | Portafolio | Hero → filtros → grid → collections rotativas | ProjectFilters (list+select móvil), ProjectGrid | Filtros CMS + Reset + refresh collections | 34 proyectos + 4 collections | Body claro | Implementado |
| `/work/[uid]` | Case study ×34 | Back → cover → meta → intro split → slices → related | ProjectSlices | See live | Imágenes/vídeos Prismic | | 34 UIDs implementados |
| `/services/` | Servicios | Hero → 3 grupos → callouts → awards → CTA | | Links work/team/contact | Quotes/awards CMS | | Implementado |
| `/team/` | Equipo | Hero → miembros → we are → founders → places → community → studio → jobs | | Links a `/team/[uid]` | 11 members + gallery | | Implementado (CMS completo) |
| `/team/[uid]` | Ficha miembro ×11 | Back → hero/bio → fun facts → Q&A → related | | Links externos | Prismic member | | Implementado (inventario DOM) |
| `/contact/` | Contacto | Hero → info/careers + form | Form | Validación local; sin endpoint | Maps link | | Implementado (envío honesto) |
| `/press/` | Press | Hero → filtros (All/Series/News/…) → series LinkedIn → lista → load more → press@ + kit ZIP | | Filtros + load more | 49 news + 3 series | | Implementado |
| `/policy/` | Cookie policy | Hero + wysiwyg + PDF | | Link PDF externo | Prismic cookie_policy | | Implementado |

## Proyectos (34)

`barbour-wallace-gromit-christmas`, `astrox-99-launch-campaign`, `nkora-coffee`, `yonex-players-lounge-paris`, `yonex-viktor-axelsen-collection-launch-campaign`, `onitsuka-tiger-finish-line-cafe`, `yonex-all-england-athlete-clubhouse`, `barbour-icons-in-quilting`, `1337-world-building`, `outfry-korean-fried-chicken-branding`, `kodama-capital`, `hotel-onitsuka-tiger`, `quest-portal-brand-universe`, `yonex-astrox-88-sd-launch-campaign`, `yonex-athlete-lounge`, `onitsuka-tiger-astro-boy`, `yonex-all-england-brand-identity`, `ghost-messaging-app-brand-identity`, `meridian-book`, `mission-barns-cultivated-meat`, `babettesbranding`, `arcfest-badminton-digital-festival`, `yonex-arcsaber-11-launch-campaign`, `tacos-padre-canned-cocktails`, `presight-partners-website-branding`, `canada-goose-the-art-of-film-berlin-2021`, `we-are-third-website`, `yonex-astrox-88sd-launch-campaign`, `super-dan-origin`, `lin-dan-x-yonex-the-memories-we-shared`, `ocha-jetro-japanese-green-tea`, `musiversal-brand-identity-video`, `cellular-agriculture-society-website`, `canada-goose-city-sense-urban-excursion-guides`

## Categorías filtro Work

All (34), SPATIAL, Campaign, Photography, Brand design, Video, Digital, Illustration

## Stack origen

Nuxt 2 estático (`_nuxt`), Lenis, Pixi (`c-PixiApp`), Prismic, fuentes Roobert locales `/fonts/*.woff2`

## Stack local

Nuxt 4.6 + Vue 3 + Lenis + GSAP + canvas aurora (aprox. Pixi) + content JSON desde Prismic
