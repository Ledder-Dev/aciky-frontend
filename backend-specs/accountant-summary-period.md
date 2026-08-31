# Resumen financiero: respetar filtro de mes, exponer intercambios del período

## Estado actual

`GET /api/transactions` acepta query param `month` (`YYYY-MM`) y filtra
correctamente el listado de transacciones devuelto. Pero el objeto `summary`
que viaja en la misma respuesta (`income_cup`, `income_usd`, `expense_cup`,
`expense_usd`, `balance_cup`, `balance_usd`) se calcula siempre sobre el
histórico completo — ignora `month` por completo.

Tampoco existe un campo que exprese el monto de intercambios de moneda
(`type = exchange`) del período; el frontend lo infiere restando
`income - expense - balance`, cálculo que solo tiene sentido mientras income,
expense y balance comparten el mismo alcance temporal (todos históricos).

## Cambio requerido

Cuando la request incluya `month`:
- `income_cup`, `income_usd`, `expense_cup`, `expense_usd` deben calcularse
  SOLO con transacciones de ese mes (mismo filtro que ya aplica el listado).
- Agregar `exchange_cup` y `exchange_usd` al summary: suma de transacciones
  `type = exchange` por moneda, también filtrada por `month` cuando aplique.
- `balance_cup` y `balance_usd` deben seguir representando el saldo real del
  fondo: SIEMPRE histórico completo (income - expense - exchange de TODAS las
  transacciones), sin importar si se pasó `month` o no. Estos dos campos no
  deben verse afectados por el filtro.

Cuando no se reciba `month`, el comportamiento debe ser equivalente al
actual (todo histórico) para los campos existentes, sumando además
`exchange_cup`/`exchange_usd` a la respuesta.

Respeta las capas Route→Controller→Service→Repository ya existentes; el
cambio vive en la capa que arma el summary agregado, no en el listado de
transacciones (que ya filtra bien).

## Por qué

El frontend (sección "Fondo ACIKY" en `accountant.html`) muestra income,
expenses e intercambios junto al balance del fondo. Al seleccionar un mes,
el usuario espera ver movimientos de ESE mes, pero el balance del fondo debe
seguir reflejando el saldo real total — dos alcances distintos que hoy se
mezclan en un summary que ignora el filtro para ambos, generando números que
no cuadran (income - expense ≠ balance mostrado).
