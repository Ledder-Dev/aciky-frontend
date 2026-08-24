# Architecture Overview

## System Diagram

```
Browser: HTML(Handlebars)+Tailwind4+Vanilla JS -> main.js (Router+Auth) -> apiFetch
  -> HTTPS ->
Backend (yoga-backend): Routes -> Controllers -> Services -> Repository -> MySQL
```

## Layers

- **Presentation**: Vite+Handlebars partials, Tailwind CSS4 `@theme` tokens, Vanilla JS ES2022+, mobile-first, Material Symbols
- **Domain**: page modules (`init*()`), `main.js` router, `auth.js` (checkAuth/requireAuth/requireAdmin), `api.js` (`apiFetch()`), bilingual i18n
- **Data**: repo separado `d:/coding/yoga-backend` (Node+Express+MySQL), Route→Controller→Service→Repository, auth por sesión httpOnly cookie

## Module Map

Core: `src/main.js`,`auth.js`,`api.js` · Partials: `src/partials/*.hbs` · Public: `pages/*.html` · Admin: `pages/admin/*.html`,`src/js/admin/*.js` · i18n: `public/locales/{es,en}.json`

## Features

Blog, Testimonials, Golden Routes, Schedule/Activities, Spaces, Events (OG share), Rebirthing/Sadhana/Festival — todas public+admin, bilingües.
Accountant (ledger CUP/USD, gated role admin/is_accountant), Donations (PayPal+CUP), Membership, Email Broadcast (admin), Settings (`site_settings`), Cleanup (Cloudinary reconciliation).

## Data Flow

- **Page load**: Vite sirve HTML -> `main.js` checkAuth() -> detecta ruta -> carga módulo -> `apiFetch()` -> render con `escapeHtml()`
- **Auth**: login -> `apiFetch('/api/auth/login')` -> backend crea sesión + httpOnly cookie -> requests futuros incluyen credentials -> páginas protegidas llaman `requireAuth()`/`requireAdmin()`
- **API**: siempre via `apiFetch()`, `credentials:'include'`, JSON body, throw en non-ok, detecta entorno (localhost/LAN/prod)

## External Deps

`yoga-backend` (REST API — CLAUDE.md en `d:/coding/yoga-backend/CLAUDE.md`) · Material Symbols (icon font) · WhatsApp API (CTAs directos)

## Cross-Repo Workflow (Backend/DB)

**CRITICAL:** nunca modificar `yoga-backend` ni escribir SQL directo.
- Backend changes: spec file en `backend-specs/<feature>.md` (estado actual + cambios requeridos, respeta Route→Controller→Service→Repository)
- DB changes: lista plana de columnas/tablas, nunca SQL — otro Claude Code en `yoga-backend` la ejecuta
- DO NOT: modificar backend directo, incluir snippets con líneas, paths detallados

## Build & Deploy

Vite 7 (multi-page) · Dev `localhost:5173` · Prod: `dist/` static en GitHub Pages · Backend: Heroku (deploy separado)
