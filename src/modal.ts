import { qs } from './shared'

const aboutModal = qs('#about-modal')
let closeTimeout: number | null = null
let previouslyFocusedElement: HTMLElement | null = null

export function openAbout() {
  if (!aboutModal) return

  if (closeTimeout !== null) {
    window.clearTimeout(closeTimeout)
    closeTimeout = null
  }

  previouslyFocusedElement = document.activeElement as HTMLElement | null

  aboutModal.hidden = false
  aboutModal.setAttribute('aria-hidden', 'false')
  void aboutModal.offsetHeight // flush layout so the fade-in actually animates
  aboutModal.classList.add('is-open')

  // Focus close button for accessibility
  const closeBtn = aboutModal.querySelector<HTMLElement>('.modal-close')
  closeBtn?.focus()
}

export function closeAbout() {
  if (!aboutModal || !aboutModal.classList.contains('is-open')) return

  aboutModal.classList.remove('is-open')
  aboutModal.setAttribute('aria-hidden', 'true')

  if (closeTimeout !== null) {
    window.clearTimeout(closeTimeout)
  }

  closeTimeout = window.setTimeout(() => {
    aboutModal.hidden = true
    closeTimeout = null
    previouslyFocusedElement?.focus()
  }, 400)
}

export function initModal() {
  // close from the backdrop / close button
  aboutModal?.querySelectorAll<HTMLElement>('[data-close]').forEach((el) =>
    el.addEventListener('click', closeAbout),
  )

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAbout()
  })

  // keep the copyright year fresh
  const yearEl = qs('#copyright-year')
  if (yearEl) yearEl.textContent = String(new Date().getFullYear())
}

