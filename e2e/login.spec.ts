import { test, expect } from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Login', () => {
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/pages/login.html')
    await page.locator('#email').fill('no-existe@aciky.org')
    await page.locator('#password').fill('wrong-password')
    await page.locator('#loginBtn').click()

    await expect(page.locator('#loginError')).toBeVisible()
    await expect(page.locator('#loginBtn')).toBeEnabled()
  })

  test('logs in as admin and redirects to admin dashboard', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL
    const password = process.env.E2E_ADMIN_PASSWORD
    test.skip(!email || !password, 'E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD not set')

    await page.goto('/pages/login.html')
    await page.locator('#email').fill(email!)
    await page.locator('#password').fill(password!)
    await page.locator('#loginBtn').click()

    await page.waitForURL('**/pages/admin/dashboard.html')
    await expect(page.locator('#adminLink')).toBeVisible()
  })
})
