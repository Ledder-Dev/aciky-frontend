# Mundo: yoga-v2 (ACIKY)

@../../CLAUDE.md

## Contexto específico
Frontend bilingüe (ES/EN) del centro de Kundalini Yoga ACIKY (Cuba). HTML5 + Tailwind CSS 4 + Vanilla JS ES2022+ + Vite 7, sin frameworks. Backend separado (Node.js + Express + MySQL) en `d:/coding/yoga-backend`.

## Referencias
- Stack + convenciones → `.claude/CONVENTIONS.md`
- Arquitectura (Route → Controller → Service → Repository) → `.claude/ARCHITECTURE.md`
- Convenciones → `.claude/CONVENTIONS.md`
- Tareas → `TASKS.md`

## Contrato de API
@$AI_OS_ROOT/_shared/contracts/aciky/api-contract.yaml

Contraparte backend: `yoga-backend`. Fuente de verdad es
`worlds/yoga-backend/dist/api-contract.yaml` — este contrato es symlink,
nunca copiar. Ver `_shared/contracts/README.md`.

## Estado actual
Recién creado el 2026-06-21. Ver TASKS.md para tareas y docs/adr/ para decisiones.
Pendiente → `TASKS.md`.

# graphify
- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.