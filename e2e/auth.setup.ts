import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')

setup('authenticate as admin', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL
  const password = process.env.E2E_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env before running e2e tests.')
  }

  await page.goto('/pages/login.html')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.locator('#loginBtn').click()

  await page.waitForURL('**/pages/admin/dashboard.html')
  await expect(page.locator('#statUsers')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
