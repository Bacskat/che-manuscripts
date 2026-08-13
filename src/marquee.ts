import { qs, shuffle, type Manuscript } from './shared'
import { MANUSCRIPTS, MANUSCRIPT_COVERS } from './data'
import { openAbout } from './modal'
import { downloadFile } from './download'

const track = qs('.marquee-track')
const isTouch = window.matchMedia('(hover: none)').matches

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
  preview.addEventListener('click', (e) => e.stopPropagation())

  const download = document.createElement('a')
  download.className = 'card-submenu-item'
  download.href = manuscript.href
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
  aboutBtn.addEventListener('click', openAbout)
  menu.appendChild(aboutBtn)

  surface.append(img, menu)
  card.appendChild(surface)

  // touch has no hover, so the first tap opens the menu
  if (isTouch) card.addEventListener('click', () => card.classList.toggle('is-open'))

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

  // tap anywhere outside a card to dismiss the open menu (mobile)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    if (!target?.closest('.card')) {
      document
        .querySelectorAll<HTMLElement>('.card.is-open')
        .forEach((c) => c.classList.remove('is-open'))
    }
  })
}
