import { test, expect, request } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'http://localhost:3000'
const authFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '.auth/admin.json')
const SEED_PREFIX = 'E2E Accountant'

async function sweepTestTransactions() {
  const api = await request.newContext({ storageState: authFile })
  const res = await api.get(`${API_BASE}/api/transactions`)
  if (res.ok()) {
    const { data = [] } = await res.json()
    const orphans = data.filter(
      (tx: { category?: string; description?: string }) =>
        tx.category?.startsWith(SEED_PREFIX) || tx.description?.startsWith(SEED_PREFIX)
    )
    for (const orphan of orphans) {
      await api.delete(`${API_BASE}/api/transactions/${orphan.id}`)
    }
  }
  await api.dispose()
}

test.beforeAll(sweepTestTransactions)
test.afterAll(sweepTestTransactions)

test.describe('Accountant: summary', () => {
  test('loads fund summary and transaction list', async ({ page }) => {
    await page.goto('/pages/admin/accountant.html')

    await expect(page.locator('#incomeCup')).not.toHaveText('—')
    await expect(page.locator('#balanceCup')).not.toHaveText('—')
    await expect(page.locator('#incomeUsd')).not.toHaveText('—')
    await expect(page.locator('#balanceUsd')).not.toHaveText('—')
    await expect(page.locator('#totalBalance')).not.toHaveText('—')
  })
})

test.describe('Accountant: transaction CRUD', () => {
  test('creates, edits, and deletes a transaction', async ({ page }) => {
    await page.goto('/pages/admin/accountant.html')
    await expect(page.locator('#incomeCup')).not.toHaveText('—')

    const category = `${SEED_PREFIX} ${Date.now()}`

    await page.locator('#addTransactionBtn').click()
    await expect(page.locator('#transactionModal')).toBeVisible()
    await page.locator('[data-modal-type="expense"]').click()
    await page.locator('#modalAmount').fill('42.50')
    await page.locator('#modalCategory').fill(category)
    await page.locator('#modalDescription').fill(SEED_PREFIX)
    await page.locator('#modalSaveBtn').click()
    await expect(page.locator('#transactionModal')).toBeHidden()

    const row = page.locator('#transactionsList > div', { hasText: category })
    await expect(row).toBeVisible()

    const editedCategory = `${category} edited`
    await row.locator('[data-action="edit"]').click()
    await expect(page.locator('#transactionModal')).toBeVisible()
    await page.locator('#modalCategory').fill(editedCategory)
    await page.locator('#modalSaveBtn').click()
    await expect(page.locator('#transactionModal')).toBeHidden()

    const editedRow = page.locator('#transactionsList > div', { hasText: editedCategory })
    await expect(editedRow).toBeVisible()

    page.once('dialog', dialog => dialog.accept())
    await editedRow.locator('[data-action="delete"]').click()
    await expect(page.locator('#transactionsList > div', { hasText: editedCategory })).toHaveCount(0)
  })
})

test.describe('Accountant: currency exchange', () => {
  test('conversion creates a paired exchange entry and can be removed', async ({ page }) => {
    await page.goto('/pages/admin/accountant.html')
    await expect(page.locator('#incomeCup')).not.toHaveText('—')

    const marker = `${SEED_PREFIX} ${Date.now()}`

    await page.locator('#convertBtn').click()
    await expect(page.locator('#conversionModal')).toBeVisible()

    await page.locator('#convCupAmount').fill('1000')
    await page.locator('#convUsdAmount').fill('2')
    await expect(page.locator('#convPreview')).toBeVisible()
    await page.locator('#convDescription').fill(marker)
    await page.locator('#convSaveBtn').click()
    await expect(page.locator('#conversionModal')).toBeHidden()

    const exchangeRows = page.locator('#transactionsList > div', { hasText: marker })
    await expect(exchangeRows).toHaveCount(2)

    for (let i = 0; i < 2; i++) {
      const remaining = page.locator('#transactionsList > div', { hasText: marker })
      page.once('dialog', dialog => dialog.accept())
      await remaining.first().locator('[data-action="delete"]').click()
      await expect(remaining).toHaveCount(1 - i)
    }
  })
})

test.describe('Accountant: filters', () => {
  test('type filter hides non-matching transactions', async ({ page }) => {
    await page.goto('/pages/admin/accountant.html')
    await expect(page.locator('#incomeCup')).not.toHaveText('—')

    await page.locator('[data-filter-type="expense"]').click()
    await expect(page.locator('#transactionsList')).not.toContainText('Ingreso')

    await page.locator('[data-filter-type="all"]').click()
  })
})
