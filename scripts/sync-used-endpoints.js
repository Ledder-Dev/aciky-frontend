// Escanea src/ en busca de llamadas apiFetch(path, options) realmente invocadas,
// las matchea contra los paths del contrato OpenAPI (por metodo + forma del path,
// no literalmente por operationId: este proyecto no llama al cliente tipado por
// operationId, ver src/js/api.js -- el match method+path es equivalente porque el
// backend deriva operationId de method+path de forma deterministica) y marca cada
// operacion usada con `x-consumers: [web]` dentro del propio YAML del contrato.
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { CONSUMER, findApiFetchCalls, loadContractOperations, computeUsedOperationIds } from './lib/endpoint-usage.js'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'src')
const CONTRACT_PATH = path.join(ROOT, '..', 'aciky-backend', 'dist', 'api-contract.yaml')

// Edicion dirigida linea a linea: preserva formato del resto del archivo,
// solo toca el bloque x-consumers de cada operacion afectada.
function syncContractFile(rawText, usedOperationIds) {
  const lines = rawText.split('\n')
  const out = []
  let added = 0
  let removed = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    out.push(line)
    const opMatch = line.match(/^(\s*)operationId:\s*(\S+)\s*$/)
    if (!opMatch) continue
    const [, indent, operationId] = opMatch
    const isUsed = usedOperationIds.has(operationId)

    // Bloque x-consumers existente inmediatamente despues (mismo indent).
    let existing = null
    let existingEnd = i
    if (lines[i + 1] === `${indent}x-consumers:`) {
      const items = []
      let j = i + 2
      while (j < lines.length && lines[j].startsWith(`${indent}  - `)) {
        items.push(lines[j].slice(`${indent}  - `.length).trim())
        j++
      }
      existing = items
      existingEnd = j - 1
    }

    if (isUsed) {
      if (existing === null) {
        out.push(`${indent}x-consumers:`, `${indent}  - ${CONSUMER}`)
        added++
      } else if (!existing.includes(CONSUMER)) {
        out.push(`${indent}x-consumers:`, ...existing.map((c) => `${indent}  - ${c}`), `${indent}  - ${CONSUMER}`)
        added++
        i = existingEnd
      } else {
        out.push(`${indent}x-consumers:`, ...existing.map((c) => `${indent}  - ${c}`))
        i = existingEnd
      }
    } else if (existing !== null && existing.includes(CONSUMER)) {
      const remaining = existing.filter((c) => c !== CONSUMER)
      if (remaining.length > 0) {
        out.push(`${indent}x-consumers:`, ...remaining.map((c) => `${indent}  - ${c}`))
      }
      removed++
      i = existingEnd
    } else if (existing !== null) {
      out.push(`${indent}x-consumers:`, ...existing.map((c) => `${indent}  - ${c}`))
      i = existingEnd
    }
  }

  return { text: out.join('\n'), added, removed }
}

function main() {
  const rawContract = fs.readFileSync(CONTRACT_PATH, 'utf8')
  const contractDoc = yaml.load(rawContract)
  const operations = loadContractOperations(contractDoc)

  const calls = findApiFetchCalls(SRC_DIR)
  const { used, unmatched } = computeUsedOperationIds(calls, operations)

  const { text, added, removed } = syncContractFile(rawContract, used)
  fs.writeFileSync(CONTRACT_PATH, text)

  console.log(`${used.size} endpoints usados, ${added} anadidos, ${removed} quitados`)
  if (unmatched.length > 0) {
    console.log(`\n${unmatched.length} llamadas apiFetch sin match en el contrato:`)
    for (const c of unmatched) {
      console.log(`  ${c.method} ${c.rawPath}  (${path.relative(ROOT, c.file)})`)
    }
  }
}

main()
