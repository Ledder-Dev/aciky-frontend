# Endpoint /__manifest para ladder-gateway

## Estado actual

`ladder-gateway` (repo separado, `worlds/ladder-gateway`) proxea las rutas de
aciky-backend consumidas por aciky-frontend (ver `gateway-routes.json`).
Para saber si cada ruta es pública, protegida o admin, el gateway consulta
`GET /__manifest` en cada backend registrado — sondea cada 10s.

aciky-backend no expone ese endpoint. Resultado: el gateway aplica
fail-closed y trata TODA ruta de aciky-backend como `"protected"`, exigiendo
un JWT emitido por `ladder-auth-service` con
`activeOrganizationId: "aciky-backend"`. Como aciky-backend usa su propio
sistema de auth (no integrado con ladder-auth-service), ningún usuario real
de aciky-frontend tiene ese JWT — todo el tráfico real vía gateway devuelve
401 hoy, incluido `/api/auth/login` de aciky mismo.

## Cambio requerido

Nuevo endpoint en aciky-backend:

```
GET /__manifest
Header requerido: X-Gateway-Secret: <mismo secreto que GATEWAY_SHARED_SECRET del gateway>
```

Responde 401 si el header falta o no coincide. Si coincide, responde JSON:

```json
[
  { "method": "GET", "path": "/api/activities", "visibility": "public" },
  { "method": "POST", "path": "/api/auth/login", "visibility": "public" },
  { "method": "DELETE", "path": "/api/users/:id", "visibility": "admin" }
]
```

- `path` usa sintaxis Express (`:param`), no `{param}` estilo OpenAPI.
- `visibility`: `"public"` (sin JWT), `"protected"` (cualquier usuario
  autenticado), `"admin"` (rol admin). Ruta sin entrada en la lista = tratada
  como `"protected"` por el gateway (fail-closed), no hace falta listar
  absolutamente todo, solo lo que deba ser público o admin.

Esta lista debe reflejar la clasificación real de cada ruta en
aciky-backend (mismo criterio que ya aplican los middlewares de auth
existentes ahí — no inventar una clasificación nueva).

## Por qué

Sin este endpoint, el gateway nunca puede servir tráfico real de
aciky-frontend — ver `worlds/ladder-gateway/README.md` §3.1 (Advertencia
operativa). Es requisito para que la Fase 6 (gateway) de
`feat/openapi-typed-client` sea funcional en producción, no solo en tests.
Depende además de que aciky resuelva su propia migración de auth hacia
`ladder-auth-service` (o un puente equivalente) — sin JWT válido de
`activeOrganizationId: "aciky-backend"`, el `/__manifest` por sí solo no
alcanza para des-bloquear el tráfico real.
