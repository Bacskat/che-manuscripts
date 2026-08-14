import { qs, randomHanzi } from './shared'
import { QUOTES } from './data'
import { getLanguage, onLanguageChange } from './i18n'

const quoteEl = qs('.quote')
const quoteEsEl = qs('.quote-es')
const quoteBlock = qs('.quote-block')

let animFrameId: number | null = null
let currentQuote = 0
const PUNCTUATION_REGEX = /[，。！？、：；“”‘’\s\u3000-\u303F,.;:'"!?¡¿\-—]/

const randomLatin = (): string =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26))

function scrambleTo(text: string) {
  if (!quoteEl) return
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  const isCJK = /[\u4e00-\u9fa5]/.test(text)
  const chars = Array.from(text)
  const frames = 26
  let frame = 0
  quoteEl.classList.add('scrambling')

  const tick = () => {
    frame++
    const locked = Math.floor((frame / frames) * chars.length)
    quoteEl.textContent = chars
      .map((ch, i) => {
        // lock chars left-to-right; keep punctuation and spaces intact from the start
        if (i < locked || PUNCTUATION_REGEX.test(ch)) return ch
        return isCJK ? randomHanzi() : randomLatin()
      })
      .join('')

    if (frame < frames) {
      animFrameId = requestAnimationFrame(tick)
    } else {
      quoteEl.textContent = text
      quoteEl.classList.remove('scrambling')
      animFrameId = null
    }
  }
  tick()
}

function setSubQuote(text: string) {
  if (!quoteEsEl) return
  quoteEsEl.classList.add('is-fading')
  window.setTimeout(() => {
    quoteEsEl.textContent = text
    quoteEsEl.classList.remove('is-fading')
  }, 220)
}

function renderCurrentQuote(isScramble = true) {
  const quote = QUOTES[currentQuote]
  const lang = getLanguage()

  let mainText = quote.zh
  let subText = quote.es

  if (lang === 'en') {
    mainText = quote.en
    subText = quote.es
  } else if (lang === 'es') {
    mainText = quote.es
    subText = quote.zh
  }

  if (isScramble) {
    scrambleTo(mainText)
  } else if (quoteEl) {
    quoteEl.textContent = mainText
  }
  setSubQuote(subText)
}

function showRandomQuote() {
  let next = Math.floor(Math.random() * QUOTES.length)
  if (next === currentQuote) next = (next + 1) % QUOTES.length
  currentQuote = next
  renderCurrentQuote(true)
}

export function initQuotes() {
  // Allow clicking on quote block to cycle quotes interactively
  quoteBlock?.addEventListener('click', () => {
    showRandomQuote()
  })

  // Respond when user switches language
  onLanguageChange(() => {
    renderCurrentQuote(false)
  })

  // Start cycling after initial hero reveal has settled
  setInterval(showRandomQuote, 7500)
}


