import { qs } from './shared'

const aboutModal = qs('#about-modal')

export function openAbout() {
  if (!aboutModal) return
  aboutModal.hidden = false
  void aboutModal.offsetHeight // flush layout so the fade-in actually animates
  aboutModal.classList.add('is-open')
}

function closeAbout() {
  if (!aboutModal) return
  aboutModal.classList.remove('is-open')
  window.setTimeout(() => {
    aboutModal.hidden = true
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
