import { qs, randomHanzi } from './shared'
import { QUOTES } from './data'

const quoteEl = qs('.quote')
const quoteEsEl = qs('.quote-es')

function scrambleTo(text: string) {
  if (!quoteEl) return
  const chars = Array.from(text)
  const frames = 28
  let frame = 0
  quoteEl.classList.add('scrambling')

  const tick = () => {
    frame++
    const locked = Math.floor((frame / frames) * chars.length)
    quoteEl.textContent = chars
      .map((ch, i) => {
        // lock chars left-to-right; keep punctuation and spaces intact from the start
        if (i < locked || ch === ' ' || ch === '，' || ch === '。') return ch
        return randomHanzi()
      })
      .join('')
    if (frame < frames) requestAnimationFrame(tick)
    else {
      quoteEl.textContent = text
      quoteEl.classList.remove('scrambling')
    }
  }
  tick()
}

function setSpanish(text: string) {
  if (!quoteEsEl) return
  quoteEsEl.classList.add('is-fading')
  window.setTimeout(() => {
    quoteEsEl.textContent = text
    quoteEsEl.classList.remove('is-fading')
  }, 220)
}

let currentQuote = -1

function showRandomQuote() {
  let next = Math.floor(Math.random() * QUOTES.length)
  if (next === currentQuote) next = (next + 1) % QUOTES.length // don't repeat the same one twice in a row
  currentQuote = next
  const { zh, es } = QUOTES[next]
  scrambleTo(zh)
  setSpanish(es)
}

export function initQuotes() {
  showRandomQuote()
  setInterval(showRandomQuote, 7000)
}
