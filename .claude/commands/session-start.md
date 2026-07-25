---
description: Inicia sesión en yoga-v2 (ACIKY) cargando contexto completo del proyecto.
---
# Session Start — yoga-v2 (ACIKY)

## Pasos

0. **Checkpoint de sesión** — antes de nada:
   - ¿Vienes de una tarea distinta a la que vas a empezar? → `/clear` primero.
   - ¿Sigues en la misma tarea pero llevas rato con MCP calls o >30min? → `/compact focus on <tarea actual>`.
   
1. `CLAUDE.md` ya cargado. Lee también `TASKS.md` (carril doing).

2. Estado del repo:
   ```bash
   git status && git log --oneline -5
   ```

3. Lee `.claude/CURRENT_STATUS.md` para ver dónde quedó la última sesión.

4. Carga contexto según la capa que vas a tocar:
   - Página / módulo JS → `.claude/ARCHITECTURE.md` + `.claude/CONVENTIONS.md`
   - Cambio de backend/BD → spec en `backend-specs/` (nunca editar `yoga-backend` directo)
   - Traducción / i18n → `.claude/CONVENTIONS.md` + `src/i18n/`
   - ADR nuevo → `docs/adr/`

5. Confirma en una frase qué vas a hacer antes de tocar cualquier código.

## Health Check

```bash
npm run build   # Build de Vite sin errores
git status      # Árbol limpio antes de empezar
```

Sin lint/test runner configurado (ver `.claude/CONVENTIONS.md` → Testing).

