import { qs, shuffle, type Manuscript } from './shared'
import { MANUSCRIPTS, MANUSCRIPT_COVERS } from './data'
import { openAbout } from './modal'
import { downloadFile } from './download'

const marqueeEl = qs('.marquee')
const track = qs('.marquee-track')

export function closeAllCards() {
  const openCards = document.querySelectorAll<HTMLElement>('.card.is-open')
  openCards.forEach((card) => {
    card.classList.remove('is-open')
    // Reset all submenus inside closed cards
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
  toggle.className = 'card-menu-item'
  toggle.textContent = manuscript.label
  toggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const willOpen = !group.classList.contains('is-open')
    // only one submenu open at a time, otherwise the card overflows
    menu
      .querySelectorAll<HTMLElement>('.card-menu-group.is-open')
      .forEach((g) => g.classList.remove('is-open'))
    if (willOpen) group.classList.add('is-open')
  })

  const submenu = document.createElement('div')
  submenu.className = 'card-submenu'

  const preview = document.createElement('a')
  preview.className = 'card-submenu-item'
  preview.href = manuscript.href
  preview.target = '_blank'
  preview.rel = 'noopener'
  preview.textContent = '预览'
  preview.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  const download = document.createElement('button')
  download.type = 'button'
  download.className = 'card-submenu-item'
  download.textContent = '下载'
  download.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    void downloadFile(manuscript.href)
  })

  submenu.append(preview, download)
  group.append(toggle, submenu)
  return group
}

function buildCard(src: string): HTMLElement {
  const card = document.createElement('article')
  card.className = 'card'

  const surface = document.createElement('div')
  surface.className = 'card-surface'

  const img = document.createElement('img')
  img.src = src
  img.alt = '切·格瓦拉手稿封面'
  img.loading = 'lazy'
  img.draggable = false

  const menu = document.createElement('div')
  menu.className = 'card-menu'

  for (const manuscript of MANUSCRIPTS) {
    menu.appendChild(buildManuscriptGroup(manuscript, menu))
  }

  const aboutBtn = document.createElement('button')
  aboutBtn.type = 'button'
  aboutBtn.className = 'card-menu-item'
  aboutBtn.textContent = 'about / 关于'
  aboutBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    openAbout()
  })
  menu.appendChild(aboutBtn)

  surface.append(img, menu)
  card.appendChild(surface)

  // Card click / tap interaction
  card.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    // If click happened on an interactive button/link inside an already-open menu, let its own handler execute
    if (target?.closest('.card-menu-item, .card-submenu-item')) {
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

  // On desktop mouseleave: reset any expanded submenu so next hover is clean
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('is-open')) {
      card.querySelectorAll<HTMLElement>('.card-menu-group.is-open').forEach((g) => {
        g.classList.remove('is-open')
      })
    }
  })

  return card
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

