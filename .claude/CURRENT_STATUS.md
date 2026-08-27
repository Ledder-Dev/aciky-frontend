# Current Project Status

Last updated: 2026-08-20

## In Progress
_Nada activo._

## Pending Actions
- **Investigar caídas intermitentes aciky.org** (530 / "response stream aborted", detectadas por monitoreo externo el 2026-08-05) — dominio usa nameservers Cloudflare vía Namecheap pero zona no aparece en cuenta Cloudflare propia del usuario. Usuario debe revisar pestaña "Cloudflare" dentro del panel Namecheap o intentar login en cloudflare.com con email de compra del dominio. Es infra/DNS, fuera del repo. Ver `TASKS.md` backlog `[infra][10]`.
- Tras merge/deploy: verificar en Search Console (Inspección de URLs) que `event.html?id=<inválido>` muestre `<meta name="robots" content="noindex">`, luego "Solicitar indexación" en las 5 URLs reportadas (`event.html` afectado, `schedule.html`, `contact.html`; los 2 `dashboard.html` bloqueados por robots.txt son intencionales, sin acción).

## Gotcha operativo
- `development` → `main` NO se auto-mergea — no hay workflow ni bot que abra/mergee PR automático (verificado 2026-08-12, sin PR pendiente tras push a `development`, sin workflow de auto-PR en `gh workflow list`). `.github/workflows/deploy.yml` solo despliega en push a `main`. Hace falta `gh pr create --base main --head development` + `gh pr merge` manual (o merge manual local) pa que un push a `development` llegue a producción.
- **Rama `development` renombrada a `devRandy`** (2026-08-20): local `git branch -m` + push como rama nueva `origin/devRandy` (trackeando). `origin/development` (remoto viejo) sigue existiendo, sin borrar — pendiente decidir si se elimina. Los 4 commits que antes estaban solo en `main` (`f2993b9`, `662c8b9`, `0d6333d`, `662db98`) ya están mergeados: `main`+`devRandy` con contenido idéntico ahora (verificado con `git diff --stat`), diferencia de conteo de commits es solo ruido de merge commits acumulados en `main` vía PRs, no código real perdido.
- `develop` (rama intermedia) estaba desalineada — 4 commits propios nunca propagados (fix import relativo CONVENTIONS, ref yoga-backend en contrato API, recorte `settings.json`, compactación `ARCHITECTURE.md`). Sincronizada 2026-08-20: merge de `devRandy` sin conflictos, sus 4 commits propios preservados, pusheada a `origin/develop`.

## Recently Completed
- [x] **infra: rename `development`→`devRandy` + sync `develop`** (2026-08-20)
  - `develop` estaba 4 commits atrás de `development`/`main` — merge sin conflictos, pusheado a `origin/develop`
  - Ver Gotcha operativo arriba pa detalle completo
- [x] **seo: faq.html a sitemap.xml + merge manual `development`→`main`** (2026-08-20)
  - Search Console: "Indexed, though blocked by robots.txt" — esperado (login/dashboard/admin), sin acción
  - `faq.html` faltaba en `public/sitemap.xml`, agregado (`monthly`, `0.7`); commit `a66d32e`, merge manual a `main` `228bc37`
- [x] **docs: FAQ ES/EN expandido 9→12 categorías + sync página viva + fix WhatsApp CTA** (2026-08-13)
  - `docs/ACIKY_FAQs.md`/`_EN.md`, `pages/faq.html`, `src/i18n/{es,en}/faq.json`, `src/js/faq.js` — commit `8c27acd`, pusheado a `origin/development`
  - Chatbot Supabase (widget `footer.html`) verificado en vivo en `aciky.org`, 3 preguntas, cero fallos. Falla solo en dev local por CORS externo, no accionable desde repo.
- [x] **fix: número WhatsApp en contact.html usa config admin, no valor fijo** (2026-08-13)
  - Mismo bug patrón encontrado luego en `pages/faq.html` (ver In Progress) — hardcode `wa.me/5350759360` reemplazado por `getWhatsAppNumber()`/`buildWhatsAppUrl()`
  - Commit `44b5c2d`, pusheado a `origin/development`
- [x] **fix: FAQ 404 en producción + fusiona link FAQ en dropdown "Nosotros"** (2026-08-12)
  - `vite.config.js`: faltaba entry `faq: resolve(__dirname, 'pages/faq.html')` en `build.rollupOptions.input` — Vite multi-page build solo emite HTML registrado ahí, dev server lo enmascaraba (sirve archivos directo de disco)
  - `header.html` desktop nav: "Nosotros" y "Preguntas Frecuentes" eran links sueltos, apretados junto a Blog/Testimonios — fusionados en dropdown "Nosotros" (mismo patrón hover ya usado por "Actividades"/"Galería"), mobile menu sin cambios (lista vertical, no apretada)
  - Verificado en navegador (dev server): FAQ carga sin 404, dropdown abre con ambos links
- [x] **feat: página FAQ (pages/faq.html) + links en header/footer** (2026-08-12)
  - `pages/faq.html`: hero + 9 categorías (36 preguntas), acordeón `<details>` nativo poblado dinámicamente vía `src/js/faq.js` desde `src/i18n/{es,en}/faq.json`
  - JSON-LD `FAQPage` inyectado en `<head>`, recalculado en cada render (incluyendo cambio de idioma)
  - Links a FAQ agregados en `header.html` (desktop+mobile) y `footer.html`; entradas `header.faq`/`footer.faq` en `common.json` ES/EN
  - Ruteo vía `main.js` `initPage()` (dynamic import `initFaq()`), siguiendo patrón existente del proyecto
  - `npm run build` verificado sin errores
- [x] **fix: widget de chat — mover de index.html a footer partial** (2026-08-11)
  - Solo salía en homepage; movido `<script>` de `widget.js` de `index.html` a `src/partials/footer.html` (`{{> footer}}`, incluido en 47/50 páginas)
  - Verificado en vivo tras auto-merge+deploy: `aciky.org/pages/testimonials.html` y `/pages/blog.html` muestran el widget
  - Sin widget por diseño (no bug): `pages/404.html`, `pages/membership.html` (doc imprimible), `pages/admin/email-broadcast.html` (admin sin partials header/footer) — confirmado con usuario dejar así
  - Commit `ca33eda`, mergeado a `main` vía PR #106 (`efa70f8`)
- [x] **feat/fix: index.html — widget de chat Supabase** (2026-08-04)
  - Script `widget.js` (Supabase Storage) añadido a homepage con `data-project-key`/`data-endpoint`
  - Color `data-primary-color` ajustado de `#e63946` (rojo) a `#708558` (verde salvia, `--color-primary` de marca)
  - Commits `a8827ba`, `6f1d01a`, pusheados a `origin/development`
- [x] **feat/fix: about.html — fotos por sección + logos de colaboraciones** (2026-07-28)
  - Historia ampliada con contenido de `NKYTA Spotlight ACIKY.docx` (fecha fundación 26 jun 2025, sección Stats, sección Colaboraciones)
  - Fotos añadidas: historia, linaje (Yogi Bhajan, flotante a la derecha del texto), membership, donate — todas banner completo sin recorte (`object-contain`/`h-auto`)
  - Grid de 10 logos de colaboraciones clickeables (`target="_blank"`) a sitio web/red social real de cada aliado, tamaño reducido a `grid-cols-8 sm:grid-cols-12`
  - Verificación visual iterativa vía Chrome MCP browser tools (screenshots ES, varias rondas de ajuste de tamaño/recorte/espaciado)
  - Commits `2218fba`, `28f9241`, `8c820aa`, `ea28fff`, `b5134da` — pusheados a `origin/development`
- [x] **fix: noindex missing/deleted events to resolve soft 404** (2026-07-28)
  - Email de Google Search Console reportó Soft 404 + 5 páginas no indexadas por 4 razones
  - `src/js/events.js`: `setNoIndex()` inyecta `<meta name="robots" content="noindex">` solo en ausencia confirmada (sin `id` o 404 explícito de API) — falla transitoria (cold-start Heroku) no des-indexa evento real
  - Diagnóstico resto de razones GSC: robots.txt (`dashboard.html`/`admin/dashboard.html`) intencional; `schedule.html`/`contact.html` sin bug de código, backend responde rápido — solo requieren "Solicitar indexación" manual
  - Commit `fc450d2` pusheado a `origin/development`; PR a `main` creado manualmente por el usuario (token MCP GitHub sin permiso pa crear PRs en este repo)
- [x] **E2E: cobertura de resto de páginas (registro, verify-email, forgot/reset-password, instructor/*, resto admin/público)** (2026-07-25)
  - `e2e/auth-flows.spec.ts`: registro (marcador `e2e-register-...@example.test` + sweep), verify-email (2 estados), forgot-password, reset-password (sin token / token inválido)
  - `e2e/instructor.spec.ts`: cuenta instructor real vía `POST /api/users` (marcador `e2e-instructor-...@example.test` + sweep), login por UI, 4 páginas instructor
  - `e2e/pages-smoke.spec.ts`: 17 páginas admin/autenticadas + 15 públicas + `event.html`/`404.html`, data-driven por selector `h1[data-i18n="..."]`
  - Bug real encontrado y corregido: `festival.js` crasheaba con `days.map is not a function` cuando `program_json` no era array (dato malformado en BD local) — ahora usa `Array.isArray`
  - `npm run test:e2e` → 61 passed, cero huérfanos verificados
- [x] **E2E: cobertura de admin users CRUD** (2026-07-25)
  - `e2e/admin-users.spec.ts`: crear/editar/eliminar usuario con `confirm()` nativo, recent registrations card sin tocar datos reales
  - Marcador único en email (`e2e-accountant-...@example.test`, dominio `.test`); sweep de seguridad por prefijo exacto de email
  - `npm run test:e2e` → 17 passed, cero huérfanos verificados
  - Gotcha: backend rechaza nombres con dígitos ("Name contains invalid characters") — marcador solo va en email, no en nombre
- [x] **E2E: cobertura de accountant (transacciones, balance, exchange)** (2026-07-25)
  - `e2e/accountant.spec.ts`: resumen de fondos, CRUD manual con `confirm()` nativo, conversión de moneda (par CUP/USD + borrado), filtro por tipo
  - Datos de prueba marcados con `E2E Accountant ...` en `category`/`description`; sweep de seguridad solo por marcador exacto (nunca patrón genérico que pudiera tocar historial financiero real)
  - `npm run test:e2e` → 15 passed, cero huérfanos verificados
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