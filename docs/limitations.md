# Limitaciones de la reconstrucción

1. **Hero WebGL:** implementado `MonopoGradient` (WebGL2 + GLSL del CE `monopo-gradient`, ruido IQ MIT). **Pixi** (imágenes/distorsión/intro tipográfica multipista `c-PixiIntro`) aún no portado; splash CSS sigue siendo simplificado frente al intro original.
2. **REA MCP / Eigent:** servidores `user-rea` y `user-eigent-rea` no autenticaron (timeout). Investigación vía browser MCP + Prismic API + REA CLI (`npx rea-agents`).
3. **Formulario contact:** validación real; **sin** POST al endpoint original (no inventado). Estado `demo` explícito.
4. **Transiciones de ruta** del original (Nuxt 2 SPA) no clonadas frame-a-frame; navegación Vue Router estándar.
5. **Chunk JS grande:** `site.json`/`projects.json` embebidos (~1MB client). Optimizable con import dinámico por UID.
6. **Publicación:** banner `DEV RECONSTRUCTION` + `noindex`. No presentar como sitio oficial.
7. **Assets:** imágenes/vídeos siguen CDN Prismic en runtime (URLs públicas). Fuentes Roobert/Noto CJK en `public/fonts` (uso solo en entorno autorizado local).
8. **Hover/cursor custom y microinteracciones Pixi** del origen: no reproducidos al 100%.
9. **Comparación visual multi-viewport (1440/768/390):** parcial — desktop verificado en localhost; tableta/móvil adaptados por CSS pero no auditados captura-a-captura contra origen en esta sesión.
