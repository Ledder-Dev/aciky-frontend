# Convenciones — yoga-v2 (ACIKY)

Hereda: @../../../_shared/CONVENTIONS.md

Convenciones inferidas de estructura real del proyecto. Más allá de linting:
decisiones de diseño que todo colaborador sigue.

---

## 1. Sin framework, stack mínimo
HTML5 + Tailwind CSS 4 + Vanilla JS ES2022+ + Vite 7 + `vite-plugin-handlebars`. Nada de React/Vue/Angular, sin TypeScript, sin CSS preprocessor. Ver `STACK.md`.

## 2. Todo API call pasa por `apiFetch()`
Nunca `fetch()` crudo. `src/js/api.js` resuelve `API_BASE` por hostname (prod/LAN/local), añade `credentials: 'include'`, Content-Type JSON, fallback `Authorization: Bearer` (token en localStorage/sessionStorage), maneja 401 limpiando storage y redirigiendo a login.

## 3. `escapeHtml()` obligatorio, definido local por módulo
Cada `src/js/*.js` que renderiza datos de usuario en HTML define su propia función `escapeHtml(str)` (no hay util compartido). Todo dato dinámico insertado vía `innerHTML` pasa por ella — previene XSS.

## 4. Patrón módulo de página
Cada página tiene módulo dedicado en `src/js/` (o `src/js/admin/`, `src/js/instructor/`) con función `init*()` exportada, llamada desde `main.js` según ruta detectada.

## 5. Partials Handlebars
Componentes reutilizables (`header`, `footer`, `admin-nav`, `bottom-nav`) en `src/partials/*.hbs`, inyectados vía `vite-plugin-handlebars`, referenciados `{{> nombre}}`.

## 6. Event delegation, no listeners duplicados
Listeners de click en contenedor padre (`container.addEventListener('click', ...)`), no un listener por elemento hijo — evita re-render que apila listeners duplicados (bug real corregido, ver historial `transaction list`).

## 7. Auth: sesión httpOnly + fallback Bearer
`auth.js` expone `checkAuth()`, `requireAuth()`, `requireAdmin()`. Backend usa cookie httpOnly (`req.session.userId`); frontend guarda fallback en localStorage para navegadores móviles que bloquean cookies cross-origin.

## 8. i18n propio, sin librería
`src/js/i18n.js` + JSON en `public/locales/es.json` / `en.json`. Sin i18next ni similares.

## 9. Colores de marca vía `@theme` (Tailwind 4)
Definidos en `src/style.css`: `--color-primary` (#708558), `--color-accent-teal/terracotta/rose`, `--color-background`, `--color-text`. Usar tokens, no hex sueltos en componentes.

## 10. Backend/BD: nunca editar directo
`yoga-backend` (repo separado, `d:/coding/yoga-backend`) se modifica vía spec file en `backend-specs/<feature>.md` — nunca código ni SQL directo desde aquí. Detalle completo → `.claude/ARCHITECTURE.md` (Cross-Repo Workflow).


---

Nota: estas convenciones se infirieron leyendo el código existente al importar
el mundo. Si contradicen algo en `_shared/CONVENTIONS.md` (universo, importado
arriba), ese documento manda para código nuevo — esto describe lo que YA hay.
Stack de este mundo no necesariamente usa Supabase (ver `_shared/CONVENTIONS.md`
sección Supabase — aplica solo si el mundo lo usa). Este mundo no usa Supabase.
