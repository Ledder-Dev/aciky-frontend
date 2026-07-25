import { test, expect, request } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'http://localhost:3000'
const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')

let seedActivityId: number | undefined

async function sweepOrphanedSeeds(api: Awaited<ReturnType<typeof request.newContext>>) {
  const listRes = await api.get(`${API_BASE}/api/activities`)
  if (!listRes.ok()) return
  const { data = [] } = await listRes.json()
  const orphans = data.filter((a: { name?: string }) => a.name?.startsWith('E2E Booking Seed'))
  for (const orphan of orphans) {
    await api.delete(`${API_BASE}/api/activities/${orphan.id}`)
  }
}

test.beforeAll(async () => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const api = await request.newContext({ storageState: authFile })

  await sweepOrphanedSeeds(api)

  const res = await api.post(`${API_BASE}/api/activities`, {
    data: {
      name: `E2E Booking Seed ${Date.now()}`,
      description: 'Seed activity for e2e booking coverage',
      schedule: 'Lunes 9:00 AM',
      class_date: futureDate,
      class_time: '09:00:00',
      duration: 60,
      location: 'Sala Principal',
      instructor_ids: [],
      price: 0,
      member_price: 0,
      icon: 'self_improvement',
      difficulty_level: 'all',
      active: true,
      featured: false
    }
  })
  if (!res.ok()) {
    const text = await res.text()
    await api.dispose()
    throw new Error(`Seed activity failed: ${res.status()} ${text}`)
  }

  const body = await res.json()
  await api.dispose()
  seedActivityId = body?.data?.id
  expect(seedActivityId).toBeTruthy()
})

test.afterAll(async () => {
  if (!seedActivityId) return
  const api = await request.newContext({ storageState: authFile })
  const res = await api.delete(`${API_BASE}/api/activities/${seedActivityId}`)
  if (!res.ok()) console.warn(`Cleanup failed for seed activity ${seedActivityId}: ${res.status()}`)
  await api.dispose()
})

test.describe('Class booking (logged out)', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('book button redirects to login with return url', async ({ page }) => {
    await page.goto('/pages/schedule.html')

    const bookBtn = page.locator('[data-book]').first()
    await expect(bookBtn).toBeVisible()
    await bookBtn.click()

    await page.waitForURL('**/pages/login.html?reason=booking&return=*')
  })
})

test.describe('Class booking (authenticated)', () => {
  test('book button opens WhatsApp deep link in new tab', async ({ page, context }) => {
    await page.goto('/pages/schedule.html')

    const bookBtn = page.locator('[data-book]').first()
    await expect(bookBtn).toBeVisible()

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      bookBtn.click()
    ])

    // wa.me redirige de inmediato a api.whatsapp.com/send — validar dominio o destino final
    expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/)
    await popup.close()
  })
})
