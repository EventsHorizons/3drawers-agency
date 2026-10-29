# 07 — Validación

## Entorno

- Dev server: `http://localhost:3010` (`npm run dev -- --port 3010`)
- REA CDP: `http://127.0.0.1:9222`
- Comparación visual: IDE browser + readPixels

## Pruebas funcionales

| Prueba | Resultado |
|---|---|
| Home carga 200 | OK |
| Pause background visible | OK |
| Intro manifesto + foot copy | OK (sessionStorage `monopo-intro-seen`) |
| Gradient WebGL no negro tras fix | OK — center RGB ≈ (77,113,162) |
| Rutas `/work`, `/team`, `/press`, `/contact`, `/services`, `/policy` | Implementadas (inventario previo + scenario live) |
| Form contact | Validación local; sin fingir éxito de API |

## Viewports

| Tamaño | Método | Notas |
|---|---|---|
| ~780×610 (IDE browser) | Screenshot local | Gradient + recent work OK; intro foot stacked |
| 1440×900 | Pendiente captura formal | Layout CSS `max-width: 1440` presente |
| 768 / 390 | Pendiente captura formal | Media queries en páginas; re-probar |

## Re-inspección REA local

- `inspect_web_page` target `687180FD…` → title correcto, Pause, CANVAS, collective/RECENT.
- Limitaciones REA estándar (sin network previa, etc.).

## Errores / diferencias pendientes

1. Pixi image FX / cursor case-study no portados.
2. Header clocks vs live.
3. QA viewport 1440/768/390 no archivada como capturas side-by-side.
4. MCP `user-rea` sin autenticar.
5. Node engine warning REA CLI (≥24.22.1).
