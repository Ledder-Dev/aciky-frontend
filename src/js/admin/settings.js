import { apiFetch } from '../api.js'
import { requireAdmin } from '../auth.js'
import { t } from '../i18n.js'
import { resetWhatsAppCache } from '../utils/whatsapp.js'

export async function initAdminSettings() {
  requireAdmin()
  await loadWhatsAppNumber()
  await loadCleanupFrequency()

  document.getElementById('whatsappSaveBtn')
    ?.addEventListener('click', saveWhatsAppNumber)

  document.getElementById('whatsappInput')
    ?.addEventListener('input', updatePreview)

  document.getElementById('cleanupFrequencySaveBtn')
    ?.addEventListener('click', saveCleanupFrequency)
}

async function loadWhatsAppNumber() {
  try {
    const data = await apiFetch('/api/settings')
    const phone = (data.data || {})['whatsapp_number'] || ''
    const input = document.getElementById('whatsappInput')
    if (input && phone) {
      input.value = phone
      updatePreview()
    }
  } catch {
    showFeedback('whatsappFeedback', t('errors.loadError'), true)
  }
}

async function saveWhatsAppNumber() {
  const input = document.getElementById('whatsappInput')
  const phone = (input?.value || '').replace(/\D/g, '').trim()

  if (!phone) {
    showFeedback(t('whatsapp.errorEmpty'), true)
    return
  }

  const btn = document.getElementById('whatsappSaveBtn')
  btn.disabled = true

  try {
    await apiFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ whatsapp_number: phone })
    })
    resetWhatsAppCache()
    if (input) input.value = phone
    updatePreview()
    showFeedback('whatsappFeedback', t('whatsapp.saved'), false)
  } catch {
    showFeedback('whatsappFeedback', t('errors.saveError'), true)
  } finally {
    btn.disabled = false
  }
}

async function loadCleanupFrequency() {
  try {
    const data = await apiFetch('/api/settings')
    const days = (data.data || {})['cleanup_frequency_days']
    const input = document.getElementById('cleanupFrequencyInput')
    if (input && days) input.value = days
  } catch {
    showFeedback('cleanupFrequencyFeedback', t('errors.loadError'), true)
  }
}

async function saveCleanupFrequency() {
  const input = document.getElementById('cleanupFrequencyInput')
  const days = Number(input?.value)

  if (!Number.isInteger(days) || days < 1) {
    showFeedback('cleanupFrequencyFeedback', t('cleanup.errorInvalid'), true)
    return
  }

  const btn = document.getElementById('cleanupFrequencySaveBtn')
  btn.disabled = true

  try {
    await apiFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ cleanup_frequency_days: days })
    })
    showFeedback('cleanupFrequencyFeedback', t('cleanup.saved'), false)
  } catch {
    showFeedback('cleanupFrequencyFeedback', t('errors.saveError'), true)
  } finally {
    btn.disabled = false
  }
}

function updatePreview() {
  const input = document.getElementById('whatsappInput')
  const phone = (input?.value || '').replace(/\D/g, '')
  const preview = document.getElementById('whatsappPreview')
  const link = document.getElementById('whatsappPreviewLink')
  if (!preview || !link) return

  if (phone) {
    const url = `https://wa.me/${phone}`
    link.href = url
    link.textContent = url
    preview.classList.remove('hidden')
  } else {
    preview.classList.add('hidden')
  }
}

function showFeedback(elementId, msg, isError) {
  const el = document.getElementById(elementId)
  if (!el) return
  el.textContent = msg
  el.className = isError
    ? 'rounded-xl px-4 py-3 text-sm bg-red-50 text-red-600'
    : 'rounded-xl px-4 py-3 text-sm bg-green-50 text-green-600'
  setTimeout(() => { el.className = 'hidden rounded-xl px-4 py-3 text-sm' }, 4000)
}
