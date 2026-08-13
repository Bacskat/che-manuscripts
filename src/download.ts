import { formatSize, qs } from './shared'

export async function downloadFile(url: string) {
  const modal = qs('#download-modal')
  const nameEl = qs('#dl-name')
  const fillEl = qs('#dl-fill')
  const sizeEl = qs('#dl-size')
  const percentEl = qs('#dl-percent')
  if (!modal || !fillEl || !sizeEl || !percentEl) return

  const filename = url.split('/').pop() ?? 'manuscript.pdf'

  modal.hidden = false
  if (nameEl) nameEl.textContent = filename
  sizeEl.textContent = '连接中…'
  percentEl.textContent = '0%'
  fillEl.style.width = '0%'

  try {
    const response = await fetch(url)
    if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

    const total = Number(response.headers.get('Content-Length')) || 0
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let loaded = 0

    // stream it in and update the bar as chunks land
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      chunks.push(value)
      loaded += value.length
      const pct = total ? Math.round((loaded / total) * 100) : 0
      fillEl.style.width = `${pct}%`
      percentEl.textContent = total ? `${pct}%` : '…'
      sizeEl.textContent = total
        ? `${formatSize(loaded)} / ${formatSize(total)}`
        : formatSize(loaded)
    }

    // assemble a blob and trigger the actual save
    const blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)

    percentEl.textContent = '100%'
    sizeEl.textContent = `完成 · ${formatSize(loaded)}`
    window.setTimeout(() => (modal.hidden = true), 900)
  } catch {
    sizeEl.textContent = '下载失败，请重试'
    percentEl.textContent = '×'
    window.setTimeout(() => (modal.hidden = true), 1800)
  }
}
