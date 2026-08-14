import { qs, shuffle, type Manuscript } from './shared'
import { MANUSCRIPTS, MANUSCRIPT_COVERS } from './data'
import { openAbout } from './modal'
import { downloadFile } from './download'
import { t, setLanguage, getLanguage, onLanguageChange, type Lang } from './i18n'

const marqueeEl = qs('.marquee')
const track = qs('.marquee-track')

export function closeAllCards() {
  const openCards = document.querySelectorAll<HTMLElement>('.card.is-open')
  openCards.forEach((card) => {
    card.classList.remove('is-open')
    card.querySelectorAll<HTMLElement>('.card-menu-group.is-open').forEach((g) => {
      g.classList.remove('is-open')
    })
  })

  // Blur active element to remove lingering mobile focus/:focus-within
  if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
    document.activeElement.blur()
  }

  marqueeEl?.classList.remove('is-card-open')
}

function buildManuscriptGroup(manuscript: Manuscript, menu: HTMLElement): HTMLElement {
  const group = document.createElement('div')
  group.className = 'card-menu-group'

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'card-menu-item item-toggle'
  toggle.textContent = t(manuscript.id)
  toggle.dataset.i18nKey = manuscript.id
  toggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const willOpen = !group.classList.contains('is-open')
    // only one submenu open at a time
    menu
      .querySelectorAll<HTMLElement>('.card-menu-group.is-open')
      .forEach((g) => g.classList.remove('is-open'))
    if (willOpen) group.classList.add('is-open')
  })

  const submenu = document.createElement('div')
  submenu.className = 'card-submenu'

  const preview = document.createElement('a')
  preview.className = 'card-submenu-item item-preview'
  preview.href = manuscript.href
  preview.target = '_blank'
  preview.rel = 'noopener'
  preview.textContent = t('btnPreview')
  preview.dataset.i18nKey = 'btnPreview'
  preview.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  const download = document.createElement('button')
  download.type = 'button'
  download.className = 'card-submenu-item item-download'
  download.textContent = t('btnDownload')
  download.dataset.i18nKey = 'btnDownload'
  download.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    void downloadFile(manuscript.href)
  })

  submenu.append(preview, download)
  group.append(toggle, submenu)
  return group
}

function buildLangPicker(): HTMLElement {
  const picker = document.createElement('div')
  picker.className = 'card-lang-picker'

  const langs: { id: Lang; label: string }[] = [
    { id: 'zh', label: '中' },
    { id: 'en', label: 'EN' },
    { id: 'es', label: 'ES' },
  ]

  for (const lang of langs) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = `lang-btn${getLanguage() === lang.id ? ' is-active' : ''}`
    btn.textContent = lang.label
    btn.dataset.lang = lang.id
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      setLanguage(lang.id)
      btn.blur() // Release focus immediately so :focus-within does not stick
    })
    picker.appendChild(btn)
  }

  return picker
}

function buildCard(src: string): HTMLElement {
  const card = document.createElement('article')
  card.className = 'card'

  const surface = document.createElement('div')
  surface.className = 'card-surface'

  const img = document.createElement('img')
  img.src = src
  img.alt = t('coverAlt')
  img.dataset.i18nKey = 'coverAlt'
  img.loading = 'lazy'
  img.draggable = false

  const menu = document.createElement('div')
  menu.className = 'card-menu'

  for (const manuscript of MANUSCRIPTS) {
    menu.appendChild(buildManuscriptGroup(manuscript, menu))
  }

  const aboutBtn = document.createElement('button')
  aboutBtn.type = 'button'
  aboutBtn.className = 'card-menu-item item-about'
  aboutBtn.textContent = t('btnAbout')
  aboutBtn.dataset.i18nKey = 'btnAbout'
  aboutBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    aboutBtn.blur()
    openAbout()
  })
  menu.appendChild(aboutBtn)

  // Language switcher below about button
  menu.appendChild(buildLangPicker())

  surface.append(img, menu)
  card.appendChild(surface)

  // Card click / tap interaction
  card.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    // If click happened on an interactive element inside menu, let its own handler execute
    if (target?.closest('.card-menu-item, .card-submenu-item, .lang-btn')) {
      return
    }

    const wasOpen = card.classList.contains('is-open')
    // Close any other open card first
    closeAllCards()

    if (!wasOpen) {
      card.classList.add('is-open')
      marqueeEl?.classList.add('is-card-open')
    }
  })

  // On desktop mouseenter: clear any lingering activeElement outside this card
  card.addEventListener('mouseenter', () => {
    if (document.activeElement instanceof HTMLElement && !card.contains(document.activeElement)) {
      document.activeElement.blur()
    }
  })

  // On desktop mouseleave: blur internal buttons and reset expanded submenus
  card.addEventListener('mouseleave', () => {
    if (card.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    if (!card.classList.contains('is-open')) {
      card.querySelectorAll<HTMLElement>('.card-menu-group.is-open').forEach((g) => {
        g.classList.remove('is-open')
      })
    }
  })

  return card
}

function updateCardTexts() {
  const current = getLanguage()

  // Update text for all i18n items in all cards
  document.querySelectorAll<HTMLElement>('.card [data-i18n-key]').forEach((el) => {
    const key = el.dataset.i18nKey as keyof typeof t extends (k: infer K) => string ? K : never
    if (key) {
      if (el instanceof HTMLImageElement) {
        el.alt = t(key as any)
      } else {
        el.textContent = t(key as any)
      }
    }
  })

  // Update active state of language buttons across all cards
  document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === current)
  })
}

function buildGroup(): HTMLElement {
  const group = document.createElement('div')
  group.className = 'marquee-group'
  for (const src of shuffle(MANUSCRIPT_COVERS)) {
    group.appendChild(buildCard(src))
  }
  return group
}

export function initMarquee() {
  // two copies of the group for a seamless infinite loop
  if (track) {
    track.append(buildGroup(), buildGroup())
  }

  // Listen for language changes and update card labels
  onLanguageChange(() => {
    updateCardTexts()
  })

  // tap anywhere outside a card to dismiss the open menu
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    if (!target?.closest('.card')) {
      closeAllCards()
    }
  })

  // Escape key closes any open card
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCards()
    }
  })
}


