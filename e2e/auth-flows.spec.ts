import { test, expect, request } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'http://localhost:3000'
const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')
const EMAIL_PREFIX = 'e2e-register-'

async function sweepTestUsers() {
  const api = await request.newContext({ storageState: authFile })
  const res = await api.get(`${API_BASE}/api/users`)
  if (res.ok()) {
    const { data = [] } = await res.json()
    const orphans = data.filter((u: { email?: string }) => u.email?.startsWith(EMAIL_PREFIX))
    for (const orphan of orphans) {
      await api.delete(`${API_BASE}/api/users/${orphan.id}`)
    }
  }
  await api.dispose()
}

test.beforeAll(sweepTestUsers)
test.afterAll(sweepTestUsers)

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Auth flows: register', () => {
  test('registers a new user and redirects to login', async ({ page }) => {
    const email = `${EMAIL_PREFIX}${Date.now()}@example.test`

    await page.goto('/pages/register.html')
    await page.locator('#name').fill('Automated Register User')
    await page.locator('#lastName').fill('Automated')
    await page.locator('#email').fill(email)
    await page.locator('#password').fill('TestPass123!')
    await page.locator('#confirmPassword').fill('TestPass123!')
    await page.locator('#registerBtn').click()

    await page.waitForURL('**/pages/login.html?registered=true*')
  })
})

test.describe('Auth flows: verify-email', () => {
  test('shows success state for status=success', async ({ page }) => {
    await page.goto('/pages/verify-email.html?status=success')
    await expect(page.locator('#verifySuccess')).toBeVisible()
    await expect(page.locator('#verifyError')).toBeHidden()
  })

  test('shows error state for unknown status', async ({ page }) => {
    await page.goto('/pages/verify-email.html?status=error&reason=expired')
    await expect(page.locator('#verifyError')).toBeVisible()
    await expect(page.locator('#verifySuccess')).toBeHidden()
    await expect(page.locator('#verifyErrorMessage')).not.toBeEmpty()
  })
})

test.describe('Auth flows: forgot-password', () => {
  test('shows generic success message regardless of email existing', async ({ page }) => {
    await page.goto('/pages/forgot-password.html')
    await page.locator('#email').fill(`e2e-forgot-${Date.now()}@example.test`)
    await page.locator('#forgotPasswordBtn').click()

    await expect(page.locator('#forgotPasswordSuccess')).toBeVisible()
  })
})

test.describe('Auth flows: reset-password', () => {
  test('redirects to forgot-password when no token is present', async ({ page }) => {
    await page.goto('/pages/reset-password.html')
    await page.waitForURL('**/pages/forgot-password.html')
  })

  test('shows invalid-token error with a dummy token', async ({ page }) => {
    await page.goto('/pages/reset-password.html?token=dummy-invalid-token')
    await page.locator('#password').fill('NewTestPass123!')
    await page.locator('#confirmPassword').fill('NewTestPass123!')
    await page.locator('#resetPasswordBtn').click()

    await expect(page.locator('#resetPasswordError')).toBeVisible()
  })
})
