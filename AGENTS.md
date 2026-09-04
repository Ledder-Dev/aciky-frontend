# yoga-v2 — Frontend ACIKY (centro Kundalini Yoga, Cuba)

## Qué es este proyecto
Frontend bilingüe (ES/EN) para ACIKY. Sitio público + panel admin + portal instructor.

## Antes de empezar
Lee `CLAUDE.md`, luego `docs/adr/` para decisiones tomadas.
Stack + convenciones en `.claude/CONVENTIONS.md`.
Estado en `CURRENT_STATUS.md`.

## Stack
HTML5 + Tailwind CSS 4 + Vanilla JS ES2022+ + Vite 7, sin frameworks
i18n: es/en · Auth: sesiones httpOnly cookie · Backend: Node.js + Express + MySQL (repo separado `d:/coding/yoga-backend`)

## Convenciones
- Nunca editar `yoga-backend` directo — cambios de backend van como spec en `backend-specs/`.
- `escapeHtml()` obligatorio pa cualquier dato de usuario insertado en HTML.
- `apiFetch()` obligatorio pa toda llamada al backend, nunca `fetch()` crudo.

## Estado actual
Ver `TASKS.md` carril doing.

<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->
