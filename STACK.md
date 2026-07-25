# Stack Tecnológico — yoga-v2 (ACIKY)

## Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| Vite | ^7.2.4 | Build tool y dev server |
| Tailwind CSS | ^4.1.18 | Utility-first CSS framework |
| @tailwindcss/vite | ^4.1.18 | Plugin Vite para Tailwind 4 |
| vite-plugin-handlebars | ^2.0.0 | Partials HTML (`{{> header}}`, `{{> footer}}`) |
| Vanilla JavaScript | ES2022+ | Sin framework (no React/Vue/Angular) |

Sin TypeScript, sin bundler alternativo (Webpack/Rollup manual), sin CSS preprocessor (SASS/SCSS).

## Backend (repo separado)

| Tecnología | Propósito |
|---|---|
| Node.js + Express | REST API |
| MySQL | Base de datos |

Repo: `d:/coding/yoga-backend`. Arquitectura: Route → Controller → Service → Repository.
Nunca editar directo desde este repo — ver `.claude/ARCHITECTURE.md` (Cross-Repo Workflow).

## Auth

Sesiones httpOnly cookie (`req.session.userId`) + fallback header `Authorization: Bearer` (token derivado de `localStorage`/`sessionStorage`) para navegadores móviles que bloquean cookies cross-origin. Ver `src/js/api.js`.

## Internacionalización

Sistema propio, sin librería externa (no i18next). `src/js/i18n.js` + JSON en `src/i18n/es/` y `src/i18n/en/`. Idiomas: Español, Inglés.

## Entornos (`API_BASE` en `src/js/api.js`)

| Hostname | API_BASE |
|---|---|
| `aciky.org` / `www.aciky.org` / `camachoeng.github.io` | `https://api.aciky.org` |
| `192.168.1.70` (LAN) | `http://192.168.1.70:3000` |
| Otro (dev local) | `http://localhost:3000` |

## Testing

| Tecnología | Estado |
|---|---|
| Playwright | `playwright.config.ts` configurado (Edge browser, `setup` project genera admin `storageState`), pero `e2e/` sin tests aún y `@playwright/test` no instalado en devDependencies |

Sin test unitario configurado. Sin ESLint/linter configurado. Verificación manual + E2E (cuando exista) son el único QA.

## Infraestructura y Despliegue

| Servicio | Propósito |
|---|---|
| GitHub Pages | Hosting frontend estático (`dist/` tras `vite build`) |
| Heroku | Hosting backend (`yoga-backend`, deploy separado) |

## Variables de Entorno

Ninguna requerida. Sin `.env` — `API_BASE` se resuelve en runtime por `window.location.hostname` (ver tabla Entornos arriba).

## Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `vite` | Dev server con HMR — `localhost:5173` |
| `build` | `vite build` | Build producción → `dist/` |
| `preview` | `vite preview` | Preview local del build |
