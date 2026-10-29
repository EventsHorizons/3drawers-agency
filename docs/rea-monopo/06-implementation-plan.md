# 06 — Plan de implementación (derivado de evidencia)

## Hecho en este ciclo REA

1. Verificar MCP `user-eigent-rea` + CDP 9222.
2. Inspeccionar live + scenario de navegación + bundle.
3. Inspeccionar local; detectar canvas negro.
4. Alinear renderer WebGL2 con CE original.
5. Reconstruir intro home (manifesto multipista + foot columns) según composición observada.
6. Documentar `docs/rea-monopo/01–07`.

## Siguiente (si se continúa el bucle)

| Prioridad | Cambio | Justificación REA |
|---|---|---|
| Alta | Pixi (o equivalente) distortion en covers work | Console Pixi + clases `c-Pixi*` |
| Media | Transición página con gradient | `c-AppTransition` en live |
| Media | Clocks header LON/TKY/NYC | Snapshot live nav |
| Baja | Stagger tipográfico intro | Comportamiento PixiIntro |
| No hacer | Ruta `/preview` marketing | Es Prismic Preview |

## Dependencias nuevas en este ciclo

Ninguna. Fixes sobre WebGL2 ya existente; `three` permanece sin uso en hero.
