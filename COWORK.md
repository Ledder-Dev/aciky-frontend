# Cowork Brief — yoga-v2
> Apunta el Project de Claude Cowork a esta carpeta.
> Claude leerá este archivo como contexto de la sesión.

## Objetivo del proyecto
Frontend bilingüe (ES/EN) del centro de Kundalini Yoga ACIKY (Cuba): páginas públicas
(programas, instructores, testimonios, blog) + panel admin para instructores/administradores.
Vanilla JS, sin frameworks. En producción, con desarrollo activo continuo.

## Contexto técnico
- Stack: Vite 7, vite-plugin-handlebars, Tailwind CSS 4, JavaScript ES2022+ vanilla (sin TS/React/Vue)
- Backend separado: `../yoga-backend/` (Node/Express/MySQL) — cambios de backend van SIEMPRE
  vía spec file en `backend-specs/<feature>.md`, nunca modificando el backend directo
- Decisiones clave: ver docs/decisions/_index.md
- Repositorio: https://github.com/camachoeng/ACIKY-frontend.git
- Deploy: GitHub Pages (frontend) + Heroku (backend)

## Tareas para delegar ahora
### En curso
- Ninguna — sin trabajo activo (ver docs/CURRENT_STATUS.md, última entrada 2026-07-20)

### Pendientes prioritarias
- Definir próximas prioridades de feature (sección abierta en docs/CURRENT_STATUS.md)

## Reglas para Cowork
- Nunca usar frameworks (React/Vue/Angular), TypeScript, jQuery, Bootstrap, SASS
- Cambios de backend SIEMPRE vía `backend-specs/<feature>.md`, nunca tocar `../yoga-backend/` directo
- Todo texto de usuario bilingüe (ES/EN) con tildes correctas
- Usar `apiFetch()` para toda llamada a backend, `escapeHtml()` para datos de usuario
- No modificar archivos fuera de esta carpeta del mundo
- Confirmar antes de borrar o renombrar archivos
- Commits: Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `perf:`, `chore:`)

## Última actualización
2026-07-22
