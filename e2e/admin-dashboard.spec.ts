import { test, expect } from '@playwright/test'

test.describe('Admin dashboard', () => {
  test('loads stats and shows admin navigation', async ({ page }) => {
    await page.goto('/pages/admin/dashboard.html')

    await expect(page.locator('#statUsers')).not.toHaveText('--')
    await expect(page.locator('#statActivities')).not.toHaveText('--')
    await expect(page.locator('#statInstructors')).not.toHaveText('--')
    await expect(page.locator('#statSpaces')).not.toHaveText('--')

    await expect(page.locator('#userMenu')).toBeVisible()
    await expect(page.locator('#adminLink')).toBeVisible()
    await expect(page.locator('nav a[href$="/pages/admin/users.html"]')).toBeVisible()
  })

  test('quick action card opens user management', async ({ page }) => {
    await page.goto('/pages/admin/dashboard.html')
    await page.locator('a[href$="/pages/admin/users.html"]').first().click()
    await page.waitForURL('**/pages/admin/users.html')
  })
})
