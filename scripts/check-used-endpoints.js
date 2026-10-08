// CI drift check (solo lectura): recorre el codigo, calcula que endpoints se usan
// de verdad (misma logica que sync-used-endpoints.js), y lo compara contra lo que
// YA esta marcado `x-consumers: [web]` en el YAML committeado. Falla si hay
// diferencia en cualquier direccion. No escribe el archivo -- eso lo hace
// `npm run sync:used-endpoints`.
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { CONSUMER, findApiFetchCalls, loadContractOperations, computeUsedOperationIds } from './lib/endpoint-usage.js'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'src')
const CONTRACT_PATH = path.join(ROOT, '..', 'aciky-backend', 'dist', 'api-contract.yaml')

function main() {
  const rawContract = fs.readFileSync(CONTRACT_PATH, 'utf8')
  const contractDoc = yaml.load(rawContract)
  const operations = loadContractOperations(contractDoc)

  const calls = findApiFetchCalls(SRC_DIR)
  const { used } = computeUsedOperationIds(calls, operations)

  const marked = new Set(operations.filter((op) => op.consumers.includes(CONSUMER)).map((op) => op.operationId))

  const missingMark = [...used].filter((id) => !marked.has(id)).sort()
  const staleMark = [...marked].filter((id) => !used.has(id)).sort()

  if (missingMark.length === 0 && staleMark.length === 0) {
    console.log(`OK: ${used.size} endpoints usados, todos marcados x-consumers: [${CONSUMER}] correctamente.`)
    return
  }

  console.error('DRIFT detectado entre uso real de endpoints y el contrato OpenAPI committeado:\n')
  if (missingMark.length > 0) {
    console.error(`  usados pero sin marca x-consumers: [${CONSUMER}]:`)
    for (const id of missingMark) console.error(`    - ${id}`)
  }
  if (staleMark.length > 0) {
    console.error(`  marcados x-consumers: [${CONSUMER}] pero ya no se usan:`)
    for (const id of staleMark) console.error(`    - ${id}`)
  }
  console.error('\nPara arreglarlo, corre: npm run sync:used-endpoints')
  console.error('y commitea el YAML del contrato actualizado (worlds/aciky-backend/dist/api-contract.yaml).')
  process.exit(1)
}

main()
