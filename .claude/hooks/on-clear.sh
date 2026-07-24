#!/usr/bin/env bash
echo "## Contexto retomado (post /clear)"
echo ""
echo "### TASKS.md — carril doing"
awk '/^## doing/,/^## [a-z]/' TASKS.md 2>/dev/null | head -30
echo ""
echo "### Último estado de sesión"
cat .claude/CURRENT_STATUS.md 2>/dev/null
echo ""
echo "### Git"
git status --short
git log --oneline -5