'use client'

import { useEffect } from 'react'

/**
 * LucideIcons — loads the Lucide UMD bundle and re-runs createIcons()
 * when the document changes.
 *
 * PERF: MutationObserver is debounced (100 ms) so icon hydration doesn't
 * fire on every DOM mutation — previously caused severe jank during
 * scroll-driven animations.
 */
export default function LucideIcons() {
  useEffect(() => {
    const ensureScript = () =>
      new Promise<void>(resolve => {
        if ((window as any).lucide) return resolve()
        const existing = document.getElementById('lucide-umd') as HTMLScriptElement | null
        if (existing) { existing.addEventListener('load', () => resolve()); return }
        const s = document.createElement('script')
        s.id = 'lucide-umd'
        s.src = 'https://unpkg.com/lucide@0.474.0/dist/umd/lucide.min.js'
        s.onload = () => resolve()
        document.head.appendChild(s)
      })

    let cancelled = false
    ensureScript().then(() => {
      if (cancelled) return
      const l = (window as any).lucide
      if (l?.createIcons) l.createIcons()
    })

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const mo = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        const l = (window as any).lucide
        if (l?.createIcons) l.createIcons()
        debounceTimer = null
      }, 100)
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelled = true
      if (debounceTimer) clearTimeout(debounceTimer)
      mo.disconnect()
    }
  }, [])

  return null
}
