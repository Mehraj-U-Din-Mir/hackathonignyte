'use client'

import { useEffect, useRef, useState } from 'react'
import { useIgReveal } from '@/lib/useIgReveal'

/**
 * IgnytePreview — ambient effects wrapper.
 * PERF: Ember count 28 → 12. Scroll handler RAF-throttled with proper cleanup.
 */
export default function IgnytePreview() {
  useIgReveal()

  const progressRef = useRef<HTMLDivElement>(null)
  const embersRef = useRef<HTMLDivElement>(null)
  const [showBack, setShowBack] = useState(false)

  /* Scroll progress + back-to-top */
  useEffect(() => {
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        const p = max > 0 ? h.scrollTop / max : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
        setShowBack(window.scrollY > 700)
      })
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      document.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  /* Embers — reduced 28 → 12 */
  useEffect(() => {
    const c = embersRef.current
    if (!c) return
    c.innerHTML = ''
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span')
      const bright = Math.random() > 0.5
      s.className = 'animate-ember absolute bottom-0 rounded-full'
      s.style.left = `${Math.random() * 100}%`
      const sz = 1.5 + Math.random() * 3
      s.style.width = `${sz}px`
      s.style.height = `${sz}px`
      s.style.background = bright ? 'oklch(0.88 0.16 75)' : 'oklch(0.76 0.18 58)'
      s.style.boxShadow = bright
        ? '0 0 8px 1px oklch(0.76 0.18 58 / 0.85)'
        : '0 0 6px 1px oklch(0.6 0.2 35 / 0.7)'
      s.style.setProperty('--dur', `${12 + Math.random() * 18}s`)
      s.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`)
      s.style.animationDelay = `${Math.random() * -24}s`
      c.appendChild(s)
    }
  }, [])

  return (
    <>
      <div ref={progressRef} className="ig-scroll-progress" />
      <div className="ig-cursor-glow" />
      <div
        ref={embersRef}
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
      />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`ig-back-to-top ${showBack ? 'show' : ''}`}
        aria-label="Back to top"
      >
        <i data-lucide="arrow-up" className="size-5" />
      </button>
    </>
  )
}
