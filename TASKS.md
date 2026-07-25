# TASKS — yoga-v2

## backlog
- [ ] [P] [e2e][4] **Cobertura e2e: accountant (transacciones, balance, exchange)** — área con bug reciente (stacked delete listeners); priorizar tras booking. (2026-07-25)
- [ ] [P] [e2e][5] **Cobertura e2e: admin users CRUD** — crear/editar/eliminar, recent registrations card. (2026-07-25)
- [ ] [P] [e2e][6] **Cobertura e2e: resto de páginas (registro, verify-email, forgot/reset-password, instructor/*, admin CRUD restante, público restante)** — smoke tests, ampliar según prioridad de negocio. (2026-07-25)

## doing

## review

## done
- [x] [P] [e2e][3] **Cobertura e2e: booking de clases (schedule.html)** — `e2e/booking.spec.ts`: redirect a login (logged out) y deep-link WhatsApp (autenticado); seed/cleanup propio vía `POST`/`DELETE /api/activities` (admin), self-healing (barre huérfanos de corridas previas antes de sembrar). 11/11 tests en verde. (2026-07-25)
- [x] [P] [e2e][2] **Correr suite e2e completa contra `yoga-backend` local** — `.env` poblado, backend levantado en `localhost:3000`, `npm run test:e2e` → 9 passed. (2026-07-25)
- [x] [P] [e2e][1] **Poblar `.env` con `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`** — acción del usuario, credenciales de su cuenta admin real, no compartir por chat. (2026-07-25)
- [x] [P] [e2e][0] **Harness Playwright inicial** — `playwright test --list` OK, 9 tests en 4 archivos: `auth.setup.ts`, `login.spec.ts`, `admin-dashboard.spec.ts`, `public-pages.spec.ts`. Script `test:e2e`/`test:e2e:ui`, `.gitignore` cubre `.env` y `e2e/.auth/`. (2026-07-23)
