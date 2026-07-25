# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ HTML Pages   │  │  Tailwind    │  │  JS Modules  │      │
│  │ (Handlebars) │  │   CSS 4      │  │  (Vanilla)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                                     │              │
│         └─────────────┬───────────────────────┘              │
│                       │                                      │
│                  ┌────▼────┐                                │
│                  │ main.js │ (Router + Auth Check)          │
│                  └────┬────┘                                │
│                       │                                      │
│                  ┌────▼────┐                                │
│                  │apiFetch │ (API Wrapper)                  │
│                  └────┬────┘                                │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTPS
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              Backend API (yoga-backend repo)                 │
│                                                              │
│  ┌────────┐   ┌────────────┐   ┌─────────┐   ┌──────────┐  │
│  │ Routes │──▶│Controllers │──▶│Services │──▶│Repository│  │
│  └────────┘   └────────────┘   └─────────┘   └────┬─────┘  │
│                                                     │        │
│                                              ┌──────▼─────┐  │
│                                              │   MySQL    │  │
│                                              └────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Layer Structure

### Presentation Layer
- **HTML Pages**: Vite + Handlebars partials (`{{> header}}`, `{{> footer}}`)
- **Styling**: Tailwind CSS 4, custom `@theme` tokens, brand colors
- **Interactivity**: Vanilla JS ES2022+ modules, no frameworks
- **Patterns**: Mobile-first responsive, semantic HTML5, Material Symbols icons

### Domain Layer (Frontend Logic)
- **Page Modules**: Each page has dedicated module, `init*()` function
- **Router**: `main.js` handles routing, loads page module
- **Auth**: `auth.js` manages auth state (`checkAuth()`, `requireAuth()`, `requireAdmin()`)
- **API Client**: `api.js` provides `apiFetch()` wrapper, credentials + error handling
- **i18n**: Bilingual (Spanish/English) via translation files

### Data Layer
- **Backend API**: Separate Node.js + Express repo at `d:/coding/yoga-backend`
- **Architecture**: Route → Controller → Service → Repository pattern
- **Auth**: Session-based, httpOnly cookies (`req.session.userId`)
- **Database**: MySQL

## Module Map

| Module | Purpose | Key Files |
|--------|---------|-----------|
| **Core** | Entry point, routing, auth | `src/main.js`, `src/js/auth.js`, `src/js/api.js` |
| **Partials** | Reusable HTML components | `src/partials/header.hbs`, `footer.hbs`, `admin-nav.hbs`, `bottom-nav.hbs` |
| **Public Pages** | User-facing pages | `index.html`, `pages/*.html` |
| **Admin Pages** | Admin panel pages | `pages/admin/*.html`, `src/js/admin/*.js` |
| **Blog** | Blog feature (public + admin) | `pages/blog.html`, `pages/admin/blog-admin.html` |
| **Testimonials** | User testimonials system | `pages/testimonials.html`, admin pages |
| **Golden Routes** | Yoga routes feature | `pages/golden-routes.html`, admin pages |
| **i18n** | Translation system | `public/locales/es.json`, `en.json` |

## Feature Inventory

- **Blog**: Public + admin pages, bilingual, instructor access from dashboard button (NOT header/admin panel), admin nav hidden for instructors, block-based content (`content_blocks` — text/image blocks, optional PDF)
- **Testimonials**: Public + admin, user submissions, admin approval, featured for homepage
- **Golden Routes**: Public + admin, bilingual routes, auto-calculated impact stats, editable "Vision" section
- **Schedule/Activities**: Public + admin, member vs. public pricing, multiple instructors per class
- **Spaces**: Public + admin, instructor assignment with manual ordering
- **Events**: Public + admin, OG share pages via backend `/share/:type/:id`
- **Rebirthing / Online Sadhana / Festival**: Public + admin pages, each own participant/program/visibility logic
- **Accountant**: CUP/USD ledger with `income`/`expense`/`exchange` transaction types, gated on `role === 'admin'` or `is_accountant` flag, edit/delete admin-only
- **Donations**: Public appeal + donate page (PayPal + CUP self-report), admin confirm/reject
- **Membership**: Printable membership guide page, dynamic leadership section
- **Email Broadcast**: Admin-only bilingual HTML email to users/instructors by role
- **Settings**: Site-wide config (WhatsApp number, PayPal URL, program visibility toggles) via `site_settings` table
- **Cleanup**: Cloudinary orphan image/PDF detection + deletion, DB-vs-Cloudinary reconciliation

## Data Flow

### Page Load Flow
1. User navigates to page, Vite serves HTML with partials injected
2. `main.js` executes, calls `checkAuth()`, updates navbar UI
3. Route detected, loads page module (e.g., `initSchedule()`)
4. Page module fetches data via `apiFetch()`, Backend API
5. API returns JSON, page module renders to DOM with `escapeHtml()`

### Authentication Flow
1. User submits login form, `apiFetch('/api/auth/login', { method: 'POST', body })`
2. Backend validates credentials, creates session, sets httpOnly cookie
3. Frontend stores user info in localStorage (fallback)
4. Subsequent requests include credentials automatically via `apiFetch()`
5. Protected pages call `requireAuth()` or `requireAdmin()` on init

### Backend Communication
- **All API calls** use `apiFetch()` from `src/js/api.js`
- **Credentials**: Included automatically (`credentials: 'include'`)
- **Content-Type**: JSON for POST/PUT/PATCH
- **Error Handling**: Throws on non-ok responses
- **Environment Detection**: Switches between localhost/LAN/production URLs

## External Dependencies

| Service | Purpose | Docs |
|---------|---------|------|
| **yoga-backend** | REST API, all data operations | `d:/coding/yoga-backend/CLAUDE.md` |
| **Material Symbols** | Icon library (web font) | https://fonts.google.com/icons |
| **WhatsApp API** | Direct messaging CTAs | https://wa.me/5350759360 |

## Cross-Repo Workflow (Backend/DB Changes)

**CRITICAL:** Never directly modify `yoga-backend` files or write SQL yourself.

**Backend changes**: create spec file at `backend-specs/<feature>.md` in this repo. Must be Claude Code-readable, describing all modifications needed in `yoga-backend`. Include:
- Current state of the backend API (existing endpoints, DB schema)
- Required changes (new endpoints, DB alterations, service/repository modifications)
- Remember: Route → Controller → Service → Repository pattern
- Backend CLAUDE.md location: `d:/coding/yoga-backend/CLAUDE.md`

**Example spec file structure:**
```markdown
# Feature Name Backend Spec

## Current State
- Endpoint: GET /api/spaces
- DB table: spaces (columns: id, name, address, location)

## Required Changes
- Add name_en column (VARCHAR 255) to spaces table
- Update spaceRepository.create() to accept bilingual fields
- Update spaceService.createSpace() to extract and pass new fields
- Add validation for required bilingual fields
```

**DO NOT:** directly modify backend files, include code snippets with line numbers, use detailed file paths in instructions.

**Database changes**: don't write SQL — provide plain column/table todo list, another Claude Code AI (working in `yoga-backend`) writes the SQL.

**Good format:**
```
Database Todo:
- Add name_en column (VARCHAR 255) to spaces table after name column
- Add address_en column (TEXT) to spaces table after address column
- Rename location column to gps_location in spaces table
```

**Bad format (DO NOT USE):**
```
ALTER TABLE spaces ADD COLUMN name_en VARCHAR(255) AFTER name;
```

## Build & Deployment

- **Build Tool**: Vite 7 (multi-page app config)
- **Dev Server**: `localhost:5173` (hot reload)
- **Production**: Static files in `dist/`, GitHub Pages
- **Backend Deploy**: Heroku (separate deployment)