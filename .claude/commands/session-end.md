---
description: Cierra la sesión de yoga-v2 (ACIKY) dejando el proyecto en estado claro.
---
# Session End — yoga-v2 (ACIKY)

## Pasos

1. Resume qué cambió esta sesión y qué quedó pendiente.

2. Actualiza `TASKS.md`:
   - Completado → mover a "done"
   - En progreso → asegurar en "doing"
   - Nuevas tareas → añadir a "backlog"

3. Actualiza `.claude/CURRENT_STATUS.md`:
   - "Last Work Done" con lo de esta sesión
   - "Known Pending Areas" si cambió algo
   - Fecha de última actualización

4. Si hubo decisión técnica relevante → crear ADR en `docs/adr/NNN-titulo.md`
   y actualizar `docs/adr/_index.md`.
   Si el patrón aplica a otros mundos → añadir a `_shared/memory/decisions.md`.

5. Propón commit en Conventional Commits:
   ```
   feat|fix|refactor|docs|chore: descripción concisa
   ```

6. Antes de commitear:
   ```bash
   git diff --staged   # revisar lo que se commitea
   git status          # confirmar que no hay .env ni secrets en staging
   ```
