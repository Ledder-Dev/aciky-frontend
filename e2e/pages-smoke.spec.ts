import { test, expect } from '@playwright/test'

// Authenticated pages (admin CRUD + user dashboard) — inherit the project's
// default admin storageState, no test.use() override needed.
const authenticatedPages = [
  { path: '/pages/admin/cleanup.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/donations.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/events.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/golden-routes.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/online-sadhana.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/posturas.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/rebirthing.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/settings.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/team-order.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/testimonials.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/videos.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/schedule.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/spaces.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/blog.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/festival.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/admin/email-broadcast.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/dashboard.html', selector: 'h1[data-i18n="title"]' },
  // contact.html requires auth (redirects to login when logged out) — belongs here, not in publicPages.
  { path: '/pages/contact.html', selector: 'h1[data-i18n="hero.title"]' }
]

test.describe('Admin/authenticated pages smoke', () => {
  for (const { path, selector } of authenticatedPages) {
    test(`${path} loads without error`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(path)
      await expect(page.locator(selector).first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }
})

// Public pages — logged out, matching e2e/public-pages.spec.ts's pattern.
const publicPages = [
  { path: '/pages/about.html', selector: 'h1[data-i18n="title"]' },
  { path: '/pages/blog.html', selector: 'h1[data-i18n="blog.title"]' },
  { path: '/pages/donate.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/donations.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/festival.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/golden-routes.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/onlinesadhana.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/posturas.html', selector: 'h1[data-i18n="posturas.title"]' },
  { path: '/pages/privacy.html', selector: 'h1[data-i18n="privacy.title"]' },
  { path: '/pages/rebirthing.html', selector: 'h1[data-i18n="hero.title"]' },
  { path: '/pages/testimonials.html', selector: 'h1[data-i18n="testimonials.title"]' },
  { path: '/pages/videos.html', selector: 'h1[data-i18n="videos.title"]' },
  { path: '/pages/terms.html', selector: 'h1[data-i18n="terms.title"]' },
  { path: '/pages/membership.html', selector: 'h2[data-i18n="doc.title"]' }
]

test.describe('Public pages smoke', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  for (const { path, selector } of publicPages) {
    test(`${path} loads without error`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(path)
      await expect(page.locator(selector).first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }

  test('event.html shows not-found state without an id', async ({ page }) => {
    await page.goto('/pages/event.html')
    await expect(page.locator('#eventNotFound')).toBeVisible()
  })

  test('404.html renders the not-found page', async ({ page }) => {
    await page.goto('/pages/404.html')
    await expect(page.locator('h1')).toContainText('404')
  })
})
