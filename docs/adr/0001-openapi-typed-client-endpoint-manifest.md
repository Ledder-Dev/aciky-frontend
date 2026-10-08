# ADR 0001 — Cliente OpenAPI tipado + manifest de endpoints consumidos para gateway

## Contexto

`api.js` envolvía `fetch()` manual sin tipos, sin forma de saber qué
endpoints del contrato de `aciky-backend` usa realmente este frontend.
`ladder-gateway` (mundo separado, ya en producción) necesita esa lista para
proxear solo las rutas consumidas, en vez de exponer el contrato completo.

## Decisión

- `apiFetch()` pasa a estar respaldado por un cliente tipado generado del
  contrato (`openapi-fetch` + `src/lib/api-types.d.ts`, `npm run
  generate:api-types`), sin cambiar la firma pública que ya usan todas las
  páginas.
- Cada operación del contrato que este frontend consume se anota
  `x-consumers: [web]`. `scripts/sync-used-endpoints.js` escanea el código
  y falla si una llamada real no tiene su anotación correspondiente (drift
  check en CI, `.github/workflows/check-endpoints.yml`).
- `scripts/generate-gateway-routes.js` filtra el contrato por esa anotación
  y produce `gateway-routes.json` ({method, path, operationId}) — es el
  artefacto que consume `ladder-gateway` para generar sus rutas proxeadas
  1:1 (ver `worlds/ladder-gateway` `[routing][013]`, commit `251b945`).

## Consecuencias

- El manifest es la fuente de verdad de "qué expone el gateway", generado
  desde uso real, no mantenido a mano.
- `ladder-gateway` vendorea una copia de `gateway-routes.json` en su propio
  repo (`aciky-backend.routes.json`, vía `npm run sync:gateway-routes`) —
  los dos repos deployan por separado, sin filesystem compartido.
- Gap conocido, no resuelto por este ADR: `aciky-backend` no expone
  `/__manifest` ni usa `ladder-auth-service` — hasta que eso se resuelva
  (spec en `backend-specs/gateway-manifest-endpoint.md`, depende de la
  migración de auth de aciky, hoy sin terminar), el gateway sirve tráfico
  real de `aciky-backend` con fail-closed 401. El manifest y el gateway
  siguen siendo útiles hoy sin eso (documentan qué se consume), pero el
  proxy en vivo no es funcional para usuarios reales todavía.
- Patrón originado en `ladder` (mismo mecanismo ahí primero), adaptado acá
  a las particularidades de `aciky` — ver `ADR-G043` en
  `_shared/memory/decisions.md`.
