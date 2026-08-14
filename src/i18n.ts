export type Lang = 'zh' | 'en' | 'es'

export interface I18nDictionary {
  // Hero section
  heroEyebrow: string
  heroTitle: string
  heroSide: string
  
  // Marquee
  marqueeLabel: string
  coverAlt: string
  
  // Manuscripts
  manuscript1966: string
  manuscript1967: string
  manuscriptEvaluaciones: string
  btnPreview: string
  btnDownload: string
  btnAbout: string
  
  // Language Switcher
  langLabel: string
  
  // About Modal
  aboutTitle: string
  aboutBody1: string
  aboutBody2: string
  aboutSourceGithub: string
  aboutClose: string
  
  // Download Modal
  dlTitle: string
  dlConnecting: string
  dlDownloading: string
  dlComplete: string
  dlFailed: string
}

export const DICTIONARY: Record<Lang, I18nDictionary> = {
  zh: {
    heroEyebrow: 'Ernesto Guevara · 1928 — 1967',
    heroTitle: '切 · 格瓦拉',
    heroSide: 'Hasta la victoria, siempre',
    
    marqueeLabel: '手稿 · Manuscripts',
    coverAlt: '切·格瓦拉手稿封面',
    
    manuscript1966: '手稿:1966',
    manuscript1967: '手稿:1967',
    manuscriptEvaluaciones: '队员评估手稿',
    btnPreview: '预览',
    btnDownload: '下载',
    btnAbout: 'about / 关于',
    
    langLabel: '语言 / Lang',
    
    aboutTitle: '关于 · About',
    aboutBody1: '本站为向<span style="color: #8d3423;">切·格瓦拉</span><span style="color: #bb270a;">同志</span>致敬而建。',
    aboutBody2: '所用手稿图片及资料，版权归其原始权利人 / 收藏机构所有；本站仅作学习、研究与纪念之用，不用于任何商业用途。',
    aboutSourceGithub: '全部源代码及资料在GitHub上',
    aboutClose: '关闭',
    
    dlTitle: '下载中 · Downloading',
    dlConnecting: '连接中…',
    dlDownloading: '下载中…',
    dlComplete: '完成',
    dlFailed: '下载失败，请重试',
  },
  en: {
    heroEyebrow: 'Ernesto Guevara · 1928 — 1967',
    heroTitle: 'Che Guevara',
    heroSide: 'Until victory, always',
    
    marqueeLabel: 'Manuscripts Archive',
    coverAlt: 'Che Guevara Manuscript Cover',
    
    manuscript1966: 'Diary: 1966',
    manuscript1967: 'Diary: 1967',
    manuscriptEvaluaciones: 'Staff Evaluations',
    btnPreview: 'Preview',
    btnDownload: 'Download',
    btnAbout: 'About',
    
    langLabel: 'Language',
    
    aboutTitle: 'About Archive',
    aboutBody1: 'Built as a tribute to Comrade <span style="color: #8d3423;">Che</span> <span style="color: #bb270a;">Guevara</span>.',
    aboutBody2: 'All manuscript images and materials belong to their original rights holders/institutions; this archive is for study, research, and memorial purposes only.',
    aboutSourceGithub: 'Full source code & archives on GitHub',
    aboutClose: 'Close',
    
    dlTitle: 'Downloading',
    dlConnecting: 'Connecting…',
    dlDownloading: 'Downloading…',
    dlComplete: 'Completed',
    dlFailed: 'Download failed, please retry',
  },
  es: {
    heroEyebrow: 'Ernesto Guevara · 1928 — 1967',
    heroTitle: 'Che Guevara',
    heroSide: 'Hasta la victoria, siempre',
    
    marqueeLabel: 'Manuscritos del Che',
    coverAlt: 'Portada de los Manuscritos del Che Guevara',
    
    manuscript1966: 'Diario: 1966',
    manuscript1967: 'Diario: 1967',
    manuscriptEvaluaciones: 'Evaluaciones',
    btnPreview: 'Vista previa',
    btnDownload: 'Descargar',
    btnAbout: 'Acerca de',
    
    langLabel: 'Idioma',
    
    aboutTitle: 'Acerca de · About',
    aboutBody1: 'Sitio creado como homenaje al camarada <span style="color: #8d3423;">Che</span> <span style="color: #bb270a;">Guevara</span>.',
    aboutBody2: 'Las imágenes y manuscritos pertenecen a sus legítimos propietarios; este sitio es exclusivamente para fines educativos, de estudio e investigación.',
    aboutSourceGithub: 'Código fuente y documentos en GitHub',
    aboutClose: 'Cerrar',
    
    dlTitle: 'Descargando',
    dlConnecting: 'Conectando…',
    dlDownloading: 'Descargando…',
    dlComplete: 'Completado',
    dlFailed: 'Error al descargar, reintente',
  },
}

const STORAGE_KEY = 'che_archive_lang'
type Listener = (lang: Lang) => void
const listeners: Listener[] = []

function detectInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
  if (saved && (saved === 'zh' || saved === 'en' || saved === 'es')) {
    return saved
  }
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('en')) return 'en'
  return 'zh'
}

let currentLang: Lang = detectInitialLang()

export function getLanguage(): Lang {
  return currentLang
}

export function t<K extends keyof I18nDictionary>(key: K): string {
  return DICTIONARY[currentLang][key] || DICTIONARY.zh[key] || ''
}

export function onLanguageChange(fn: Listener): () => void {
  listeners.push(fn)
  return () => {
    const idx = listeners.indexOf(fn)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

export function setLanguage(lang: Lang) {
  if (lang === currentLang) return
  currentLang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Ignore localStorage access errors (e.g. private mode)
  }

  updateDomI18n()

  for (const fn of listeners) {
    fn(lang)
  }
}

export function updateDomI18n() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang

  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]')
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n') as keyof I18nDictionary | null
    if (!key || !DICTIONARY[currentLang][key]) return

    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = DICTIONARY[currentLang][key]
    } else {
      el.textContent = DICTIONARY[currentLang][key]
    }
  })

  // Update aria-labels
  const ariaElements = document.querySelectorAll<HTMLElement>('[data-i18n-aria]')
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria') as keyof I18nDictionary | null
    if (key && DICTIONARY[currentLang][key]) {
      el.setAttribute('aria-label', DICTIONARY[currentLang][key])
    }
  })
}
