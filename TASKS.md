# TASKS — yoga-v2

## backlog
- [ ] [P] [e2e][1] **Poblar `.env` con `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`** — acción del usuario, credenciales de su cuenta admin real, no compartir por chat. (2026-07-23)
- [ ] [P] [e2e][2] **Correr suite e2e completa contra `yoga-backend` local** — requiere backend en `localhost:3000` y `.env` poblado. (2026-07-23)

## doing

## review

## done
- [x] [P] [e2e][0] **Harness Playwright inicial** — `playwright test --list` OK, 9 tests en 4 archivos: `auth.setup.ts`, `login.spec.ts`, `admin-dashboard.spec.ts`, `public-pages.spec.ts`. Script `test:e2e`/`test:e2e:ui`, `.gitignore` cubre `.env` y `e2e/.auth/`. (2026-07-23)
