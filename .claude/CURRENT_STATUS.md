# Current Project Status

Last updated: 2026-07-23

## In Progress
_No active work now._

## Pending Actions
- [ ] User: poblar `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` en `.env` local (cuenta admin real, no compartir por chat)
- [ ] Confirmar `yoga-backend` corriendo en `localhost:3000` antes de correr `npm run test:e2e`

## Recently Completed
- [x] **E2E test harness (Playwright)** (2026-07-23)
  - `e2e/auth.setup.ts` (login admin, guarda `e2e/.auth/admin.json`), `e2e/login.spec.ts`, `e2e/admin-dashboard.spec.ts`, `e2e/public-pages.spec.ts`
  - `npm run test:e2e` / `test:e2e:ui`; `.gitignore` cubre `.env` y `e2e/.auth/`
  - `playwright test --list` confirma 9 tests, sin credenciales corridas aún
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