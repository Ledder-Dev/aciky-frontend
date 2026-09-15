import createClient from 'openapi-fetch'

/** @typedef {import('./api-types.d.ts').paths} paths */

/**
 * Typed client factory generated from the OpenAPI contract (see `npm run generate:api-types`).
 * Takes baseUrl as a param (instead of importing it) to avoid a circular import with `src/js/api.js`.
 * @param {string} baseUrl
 */
export function createApiClient(baseUrl) {
  return /** @type {import('openapi-fetch').Client<paths>} */ (
    createClient({ baseUrl, credentials: 'include' })
  )
}
