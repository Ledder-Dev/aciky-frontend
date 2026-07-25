import { test, expect, request, type Page } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'http://localhost:3000'
const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')
const EMAIL_PREFIX = 'e2e-instructor-'
const PASSWORD = 'TestPass123!'

let instructorEmail: string

async function sweepTestInstructors() {
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

test.beforeAll(async () => {
  await sweepTestInstructors()

  instructorEmail = `${EMAIL_PREFIX}${Date.now()}@example.test`
  const api = await request.newContext({ storageState: authFile })
  const res = await api.post(`${API_BASE}/api/users`, {
    data: {
      name: 'Automated Instructor',
      last_name: 'User',
      spiritual_name: null,
      email: instructorEmail,
      password: PASSWORD,
      role: 'instructor'
    }
  })
  if (!res.ok()) {
    const text = await res.text()
    await api.dispose()
    throw new Error(`Failed to create test instructor: ${res.status()} ${text}`)
  }
  await api.dispose()
})

test.afterAll(sweepTestInstructors)

test.use({ storageState: { cookies: [], origins: [] } })

async function loginAsInstructor(page: Page) {
  await page.goto('/pages/login.html')
  await page.locator('#email').fill(instructorEmail)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('#loginBtn').click()
  await page.waitForURL((url) => !url.pathname.includes('login.html'))
}

test.describe('Instructor pages', () => {
  test('my-classes loads without error', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await loginAsInstructor(page)
    await page.goto('/pages/instructor/my-classes.html')

    await expect(page.locator('#classesLoading')).toBeHidden()
    await expect(page.locator('#classesContainer')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('my-rebirthing loads without error', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await loginAsInstructor(page)
    await page.goto('/pages/instructor/my-rebirthing.html')

    await expect(page.locator('#sessionsLoading')).toBeHidden()
    await expect(page.locator('#sessionsContainer')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('my-routes loads without error', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await loginAsInstructor(page)
    await page.goto('/pages/instructor/my-routes.html')

    await expect(page.locator('#routesLoading')).toBeHidden()
    await expect(page.locator('#routesContainer')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('my-space loads without error', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await loginAsInstructor(page)
    await page.goto('/pages/instructor/my-space.html')

    await expect(page.locator('#spaceLoading')).toBeHidden()
    expect(errors).toEqual([])
  })
})
