import { test, expect } from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Public pages smoke', () => {
  test('home loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await expect(page.locator('header h1')).toHaveText('ACIKY')
    await expect(page.locator('#authButtons')).toBeVisible()
    await expect(page.locator('#userMenu')).toBeHidden()
    expect(errors).toEqual([])
  })

  test('schedule page loads', async ({ page }) => {
    await page.goto('/pages/schedule.html')
    await expect(page.locator('h1[data-i18n="title"]')).toBeVisible()
  })

  test('spaces page loads', async ({ page }) => {
    await page.goto('/pages/spaces.html')
    await expect(page.locator('h1[data-i18n="hero.title"]')).toBeVisible()
  })

  test('language toggle switches EN/ES', async ({ page }) => {
    await page.goto('/')
    const toggleText = page.locator('#langToggleText')
    const initial = await toggleText.textContent()

    await page.locator('#langToggle').click()
    await expect(toggleText).not.toHaveText(initial ?? '')
  })
})
