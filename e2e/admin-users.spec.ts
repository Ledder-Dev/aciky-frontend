import { test, expect, request } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'http://localhost:3000'
const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')
const EMAIL_PREFIX = 'e2e-accountant-'

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

test.describe('Admin users: CRUD', () => {
  test('creates, edits, and deletes a user', async ({ page }) => {
    await page.goto('/pages/admin/users.html')
    await expect(page.locator('#usersTableBody tr').first()).toBeVisible()

    const email = `${EMAIL_PREFIX}${Date.now()}@example.test`
    const name = `Automated Test User`

    await page.locator('#createUserBtn').click()
    await expect(page.locator('#userModal')).toBeVisible()
    await page.locator('#userName').fill(name)
    await page.locator('#userLastName').fill('User')
    await page.locator('#userEmail').fill(email)
    await page.locator('#userPassword').fill('TestPass123!')
    await page.locator('#userPasswordConfirm').fill('TestPass123!')
    await page.locator('#userRole').selectOption('user')
    await page.locator('#userForm button[type="submit"]').click()
    await expect(page.locator('#userModal')).toBeHidden()

    await page.locator('#usersSearch').fill(email)
    const row = page.locator('#usersTableBody tr', { hasText: email })
    await expect(row).toBeVisible()

    const editedName = `${name} Edited`
    await row.locator('[data-action="edit"]').click()
    await expect(page.locator('#userModal')).toBeVisible()
    await page.locator('#userName').fill(editedName)
    await page.locator('#userForm button[type="submit"]').click()
    await expect(page.locator('#userModal')).toBeHidden()

    await page.locator('#usersSearch').fill(email)
    const editedRow = page.locator('#usersTableBody tr', { hasText: email })
    await expect(editedRow).toContainText(editedName)

    page.once('dialog', dialog => dialog.accept())
    await editedRow.locator('[data-action="delete"]').click()
    await page.locator('#usersSearch').fill(email)
    await expect(page.locator('#usersTableBody tr', { hasText: email })).toHaveCount(0)
  })
})

test.describe('Admin users: recent registrations', () => {
  test('recent registrations card renders without error', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/pages/admin/users.html')
    await expect(page.locator('#usersTableBody tr').first()).toBeVisible()

    // Card is hidden when there are no recent registrations, visible otherwise — either is valid.
    const card = page.locator('#recentRegistrationsCard')
    await expect(card).toBeAttached()

    expect(errors).toEqual([])
  })
})
