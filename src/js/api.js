import { createApiClient } from '../lib/api-client.js'

// API Configuration
export const API_BASE =
  window.location.hostname === 'aciky.org' ||
  window.location.hostname === 'www.aciky.org' ||
  window.location.hostname === 'camachoeng.github.io'
    ? 'https://api.aciky.org'
    : window.location.hostname === '192.168.1.70'
    ? 'http://192.168.1.70:3000'
    : 'http://localhost:3000'

/**
 * Get full API URL for a path
 */
export function getApiUrl(path) {
  return `${API_BASE}${path}`
}

/**
 * Build Authorization header from localStorage user data.
 * Matches the token format expected by the backend's authToken.js.
 * Used as fallback for mobile browsers that block cross-origin session cookies.
 */
function getAuthHeader() {
  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    const loginTime = localStorage.getItem('loginTime') || sessionStorage.getItem('loginTime')
    if (!userStr || !loginTime) return {}
    const user = JSON.parse(userStr)
    if (!user?.id) return {}
    const token = btoa(JSON.stringify({ id: user.id, loginTime: parseInt(loginTime) }))
    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

// Typed client (generated from the OpenAPI contract, see `npm run generate:api-types`).
// bodySerializer is identity because call sites already JSON.stringify their own bodies.
const apiClient = createApiClient(API_BASE)
apiClient.use({
  onRequest({ request }) {
    const auth = getAuthHeader()
    if (auth.Authorization) request.headers.set('Authorization', auth.Authorization)
    if (request.method === 'GET' || request.method === 'HEAD') {
      request.headers.delete('Content-Type')
    }
    return request
  }
})

/**
 * Fetch wrapper with credentials and JSON handling.
 * Throws on non-ok responses with the server's error message.
 * Internally backed by the typed OpenAPI client (see `src/lib/api-client.js`).
 */
export async function apiFetch(path, options = {}) {
  const { skipAuthRedirect, method = 'GET', body, headers } = options
  const httpMethod = method.toUpperCase()

  const { data, error, response } = await apiClient[httpMethod](path, {
    body,
    headers,
    bodySerializer: (b) => b
  })

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = import.meta.env.BASE_URL + 'pages/login.html'
      return
    }
    const err = new Error(error?.message || 'Request failed')
    err.status = response.status
    err.data = error
    throw err
  }

  return data
}
