# Current Project Status

Last updated: 2026-07-25

## In Progress
_No active work now._

## Pending Actions
_Ninguna — suite e2e corrida y en verde._

## Recently Completed
- [x] **E2E: cobertura de booking de clases** (2026-07-25)
  - `e2e/booking.spec.ts`: gate de auth (redirect a login con `reason=booking&return=`) + deep-link WhatsApp (`wa.me`/`api.whatsapp.com`)
  - Seed/cleanup propio vía API admin (`POST`/`DELETE /api/activities`), self-healing (barre huérfanos de corridas previas)
  - `npm run test:e2e` → 11 passed
- [x] **E2E suite corrida en verde contra backend local** (2026-07-25)
  - `.env` poblado (`E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`), `yoga-backend` levantado en `localhost:3000`
  - `npm run test:e2e` → 9 passed (15.7s)
- [x] **fix: skip auth redirect loop on failed login attempts** (2026-07-25)
  - `apiFetch` redirigía a login en cualquier 401, incluso el propio POST de login fallido; nuevo flag `skipAuthRedirect`
- [x] **fix: rename activity-cards asset folder to remove space** (2026-07-25)
  - `public/images/activity cards/` → `activity-cards/`, refs actualizadas en `index.html`
- [x] **chore: bump e2e default port to 5174, add contract drift hook** (2026-07-25)
  - Playwright `baseURL` sigue al puerto real de Vite; `SessionStart` hook avisa si cambia el contrato ACIKY
- [x] **E2E test harness (Playwright)** (2026-07-23)
  - `e2e/auth.setup.ts` (login admin, guarda `e2e/.auth/admin.json`), `e2e/login.spec.ts`, `e2e/admin-dashboard.spec.ts`, `e2e/public-pages.spec.ts`
  - `npm run test:e2e` / `test:e2e:ui`; `.gitignore` cubre `.env` y `e2e/.auth/`
- [x] **Admin users: recent registrations report** (2026-07-20)
  - Dismissible "Nuevos registros" card on `pages/admin/users.html`, backed by `registration_seen_at` on `users`
- [x] **Accountant: total equivalent card + delete-listener bug** (2026-07-18–19)
  - Balance now sums `balance_cup + balance_usd`; fixed stacked delete-click listeners
- [x] **Accounting: currency exchange type + correct per-currency balances** (2026-05-02–03)
  - Exchange transactions no longer inflate income/expense totals
- [x] **Production hotfixes** (2026-05-02)
  - Missing `member_price` column, `my-classes` route ordering, broadcast email greeting
- [x] **Membership guide expanded + email broadcast async fix** (2026-04-28–30)

Full history: `git log --oneline` or earlier commits touching `backend-specs/`.

## Known Issues
_None now._

## Next Priorities
_[User define next feature priorities]_

---

**Note**: Update file end of each work session. Keep only current/recent state — full history lives git log, not here.