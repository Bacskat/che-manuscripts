import { formatSize, qs } from './shared'
import { t } from './i18n'

let isDownloading = false

export async function downloadFile(url: string) {
  if (isDownloading) return

  const modal = qs('#download-modal')
  const nameEl = qs('#dl-name')
  const fillEl = qs('#dl-fill')
  const sizeEl = qs('#dl-size')
  const percentEl = qs('#dl-percent')
  if (!modal || !fillEl || !sizeEl || !percentEl) return

  isDownloading = true
  const rawFilename = url.split('/').pop() ?? 'manuscript.pdf'
  const filename = decodeURIComponent(rawFilename)

  modal.hidden = false
  void modal.offsetHeight
  modal.classList.add('is-open')

  if (nameEl) nameEl.textContent = filename
  sizeEl.textContent = t('dlConnecting')
  percentEl.textContent = '0%'
  fillEl.style.width = '0%'

  const hideModal = (delayMs: number) => {
    window.setTimeout(() => {
      modal.classList.remove('is-open')
      window.setTimeout(() => {
        modal.hidden = true
        isDownloading = false
      }, 350)
    }, delayMs)
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    let blob: Blob
    let loaded = 0

    if (response.body && typeof response.body.getReader === 'function') {
      const total = Number(response.headers.get('Content-Length')) || 0
      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (!value) continue
        chunks.push(value)
        loaded += value.length
        const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : 0
        fillEl.style.width = `${pct}%`
        percentEl.textContent = total ? `${pct}%` : '…'
        sizeEl.textContent = total
          ? `${formatSize(loaded)} / ${formatSize(total)}`
          : formatSize(loaded)
      }

      blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' })
    } else {
      fillEl.style.width = '50%'
      percentEl.textContent = '…'
      sizeEl.textContent = t('dlDownloading')
      blob = await response.blob()
      loaded = blob.size
      fillEl.style.width = '100%'
    }

    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()

    // Safely revoke blob URL after browser has had time to start file write (fixes Safari/Firefox)
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)

    percentEl.textContent = '100%'
    sizeEl.textContent = `${t('dlComplete')} · ${formatSize(loaded)}`
    hideModal(900)
  } catch {
    sizeEl.textContent = t('dlFailed')
    percentEl.textContent = '×'
    hideModal(1800)
  }
}

