// Lee el contrato OpenAPI ya anotado (x-consumers) y vuelca las operaciones
// consumidas por `web` a gateway-routes.json -- input de Fase 6 (gateway).
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { CONSUMER, loadContractOperations } from './lib/endpoint-usage.js'

const ROOT = process.cwd()
const CONTRACT_PATH = path.join(ROOT, '..', 'aciky-backend', 'dist', 'api-contract.yaml')
const OUTPUT_PATH = path.join(ROOT, 'gateway-routes.json')

function main() {
  const contractDoc = yaml.load(fs.readFileSync(CONTRACT_PATH, 'utf8'))
  const operations = loadContractOperations(contractDoc)

  const routes = operations
    .filter((op) => op.consumers.includes(CONSUMER))
    .map((op) => ({ method: op.method, path: op.pathTemplate, operationId: op.operationId }))
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2) + '\n')
  console.log(`${routes.length} rutas escritas en ${path.relative(ROOT, OUTPUT_PATH)}`)
}

main()
