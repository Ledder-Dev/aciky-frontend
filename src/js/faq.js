import { t } from './i18n.js'

function escapeHtml(str) {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function renderFaqSections() {
  const items = []

  document.querySelectorAll('[data-faq-cat]').forEach(container => {
    const cat = container.dataset.faqCat
    const count = parseInt(container.dataset.faqCount, 10)

    let html = ''
    for (let i = 1; i <= count; i++) {
      const question = t(`${cat}.q${i}`)
      const answer = t(`${cat}.a${i}`)
      html += `
        <details class="group py-3">
          <summary class="flex items-center justify-between gap-2 cursor-pointer list-none font-semibold text-primary-dark text-sm">
            <span>${escapeHtml(question)}</span>
            <span class="material-symbols-outlined text-primary text-lg flex-shrink-0 transition-transform group-open:rotate-180">expand_more</span>
          </summary>
          <p class="mt-2 text-slate-600 text-sm leading-relaxed">${escapeHtml(answer)}</p>
        </details>`
      items.push({ question, answer })
    }
    container.innerHTML = html
  })

  injectFaqSchema(items)
}

function injectFaqSchema(items) {
  document.getElementById('faqSchema')?.remove()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  }

  const script = document.createElement('script')
  script.id = 'faqSchema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

export function initFaq() {
  renderFaqSections()
  window.addEventListener('languageChanged', renderFaqSections)
}
