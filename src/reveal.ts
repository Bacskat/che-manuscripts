import { qs } from './shared'

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const
type Direction = (typeof DIRECTIONS)[number]

// which way the loader exits vs which way the hero chases in from the other side
const OPPOSITE: Record<Direction, Direction> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

// keep these in sync with the CSS animation durations
const LOAD_HOLD_MS = 2450
const SETTLE_DELAY_MS = 1050

const loader = qs('#loader')
const hero = qs('#hero')
const heroImg = qs<HTMLImageElement>('.hero-bg img')

let revealed = false

function reveal() {
  if (revealed) return
  revealed = true

  // force a reflow, otherwise the browser skips the transition entirely (classic gotcha)
  void loader?.offsetHeight

  requestAnimationFrame(() => {
    loader?.classList.add('is-done')
    hero?.classList.add('is-revealed')
    window.setTimeout(() => hero?.classList.add('is-settled'), SETTLE_DELAY_MS)
  })
}

function beginReveal() {
  window.setTimeout(reveal, LOAD_HOLD_MS)
}

// split the loader title/subtitle into per-char spans so CSS can stagger them
function splitIntoChars(root: HTMLElement, selector: string) {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (el.classList.contains('fill')) return // the red-ink overlay keeps its full text
    el.innerHTML = Array.from(el.textContent ?? '')
      .map(
        (ch, i) =>
          `<span class="ch" style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`,
      )
      .join('')
  })
}

export function initReveal() {
  // random drawer direction — loader slides out one way, hero follows from the other
  const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
  loader?.classList.add(`out-${direction}`)
  hero?.classList.add(`in-${OPPOSITE[direction]}`)

  if (heroImg) {
    if (heroImg.complete) beginReveal()
    else {
      heroImg.addEventListener('load', beginReveal, { once: true })
      heroImg.addEventListener('error', beginReveal, { once: true })
    }
  }

  // last resort — don't leave anyone staring at a white screen
  window.setTimeout(reveal, 6000)

  if (loader) splitIntoChars(loader, '.loader-title .txt, .loader-sub .txt')
}
