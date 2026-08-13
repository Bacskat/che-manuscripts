// types

export interface Quote {
  zh: string
  es: string
}

export interface Manuscript {
  label: string
  href: string
}

// helpers

// typed querySelector — because typing `HTMLElement` over and over is annoying
export const qs = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
  document.querySelector<T>(selector)

// Fisher-Yates. returns a copy so we don't mutate the source
export const shuffle = <T>(input: readonly T[]): T[] => {
  const out = [...input]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// random CJK glyph for the quote decode-scramble effect
export const randomHanzi = (): string =>
  String.fromCharCode(0x4e00 + Math.floor(Math.random() * 0x51a5))
