// Logica compartida de extraccion de uso de endpoints, usada por
// sync-used-endpoints.js (modo mutante) y check-used-endpoints.js (modo lectura).
import fs from 'node:fs'
import path from 'node:path'

export const CONSUMER = 'web'
const WILDCARD = Symbol('wildcard')

function walk(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full)
  }
  return files
}

// Extrae el texto entre parentesis balanceados a partir de `start` (indice del '(' inicial).
function extractBalanced(text, start) {
  let depth = 0
  let inStr = null
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inStr) {
      if (c === '\\') i++
      else if (c === inStr) inStr = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') inStr = c
    else if (c === '(') depth++
    else if (c === ')') {
      depth--
      if (depth === 0) return text.slice(start + 1, i)
    }
  }
  return null
}

// Convierte el path llamado en runtime (literal o template literal) en segmentos
// matcheables contra el path template del contrato ('{id}' -> comodin).
// Un segmento entero `${expr}` es un path param (-> comodin). Una interpolacion
// pegada al final de un segmento literal (ej. `transactions${qs}`) es sufijo de
// query string, se descarta y se conserva solo el prefijo literal.
function toSegments(rawPath) {
  const noQuery = rawPath.split('?')[0]
  const segments = []
  for (const seg of noQuery.split('/')) {
    if (!seg) continue
    if (/^\$\{[^}]*\}$/.test(seg)) {
      segments.push(WILDCARD)
    } else if (seg.includes('${')) {
      const literalPrefix = seg.slice(0, seg.indexOf('${'))
      if (literalPrefix) segments.push(literalPrefix)
    } else {
      segments.push(seg)
    }
  }
  return segments
}

function segmentsMatch(callSegs, contractSegs) {
  if (callSegs.length !== contractSegs.length) return false
  return callSegs.every((seg, i) => {
    const c = contractSegs[i]
    const contractIsParam = typeof c === 'string' && c.startsWith('{')
    if (seg === WILDCARD || contractIsParam) return true
    return seg === c
  })
}

export function findApiFetchCalls(sourceDir) {
  const calls = []
  for (const file of walk(sourceDir)) {
    const text = fs.readFileSync(file, 'utf8')
    const re = /apiFetch\(/g
    let m
    while ((m = re.exec(text))) {
      const argsStart = m.index + m[0].length - 1
      const args = extractBalanced(text, argsStart)
      if (args === null) continue
      const pathMatch = args.match(/^\s*(['"`])([\s\S]*?)\1/)
      if (!pathMatch) continue
      const rawPath = pathMatch[2]
      const methodMatch = args.match(/method:\s*['"](\w+)['"]/)
      const method = (methodMatch ? methodMatch[1] : 'GET').toUpperCase()
      calls.push({ file, rawPath, method })
    }
  }
  return calls
}

export function loadContractOperations(contractDoc) {
  const ops = []
  for (const [pathTemplate, methods] of Object.entries(contractDoc.paths || {})) {
    const contractSegs = pathTemplate.split('/').filter(Boolean)
    for (const [method, operation] of Object.entries(methods)) {
      if (!operation || typeof operation !== 'object' || !operation.operationId) continue
      ops.push({
        operationId: operation.operationId,
        method: method.toUpperCase(),
        pathTemplate,
        segments: contractSegs,
        consumers: Array.isArray(operation['x-consumers']) ? operation['x-consumers'] : []
      })
    }
  }
  return ops
}

export function computeUsedOperationIds(calls, operations) {
  const used = new Set()
  const unmatched = []
  for (const call of calls) {
    const callSegs = toSegments(call.rawPath)
    const match = operations.find(
      (op) => op.method === call.method && segmentsMatch(callSegs, op.segments)
    )
    if (match) used.add(match.operationId)
    else unmatched.push(call)
  }
  return { used, unmatched }
}
