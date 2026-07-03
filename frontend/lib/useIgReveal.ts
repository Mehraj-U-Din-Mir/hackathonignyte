'use client'

import { useEffect } from 'react'

/**
 * useIgReveal — wires up scroll reveal, spotlight, magnetic, and tilt effects.
 *
 * PERF: Spotlight and tilt mouse handlers are RAF-gated so they only update
 * once per render frame instead of firing on every pixel of cursor movement.
 * IntersectionObserver is properly disconnected on unmount.
 */
export function useIgReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches

    /* 1. Reveal on scroll */
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.ig-reveal'))
    let io: IntersectionObserver | null = null

    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('in'))
    } else if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              io?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      revealEls.forEach(el => io!.observe(el))
    } else {
      revealEls.forEach(el => el.classList.add('in'))
    }

    /* 2. Spotlight cursor follow — RAF throttled */
    if (!isCoarse) {
      const spotEls = Array.from(document.querySelectorAll<HTMLElement>('.spotlight'))
      let spotPending = false
      const onSpot = (e: MouseEvent) => {
        if (spotPending) return
        spotPending = true
        requestAnimationFrame(() => {
          spotEls.forEach(el => {
            const r = el.getBoundingClientRect()
            el.style.setProperty('--mx', `${e.clientX - r.left}px`)
            el.style.setProperty('--my', `${e.clientY - r.top}px`)
          })
          spotPending = false
        })
      }
      document.addEventListener('mousemove', onSpot, { passive: true })
      ;(window as any).__igSpotCleanup = () => document.removeEventListener('mousemove', onSpot)
    }

    /* 3. Magnetic buttons — RAF throttled */
    if (!isCoarse) {
      const magEls = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
      const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = []
      magEls.forEach(el => {
        const str = parseFloat(el.dataset.magneticStrength || '0.3')
        const inner = el.querySelector<HTMLElement>('.magnetic-inner')
        let pending = false
        const move = (e: MouseEvent) => {
          if (pending) return; pending = true
          requestAnimationFrame(() => {
            const r = el.getBoundingClientRect()
            const x = (e.clientX - r.left - r.width / 2) * str
            const y = (e.clientY - r.top - r.height / 2) * str
            el.style.transform = `translate(${x}px,${y}px)`
            if (inner) inner.style.transform = `translate(${x * 0.4}px,${y * 0.4}px)`
            pending = false
          })
        }
        const leave = () => { el.style.transform = ''; if (inner) inner.style.transform = '' }
        el.addEventListener('mousemove', move, { passive: true })
        el.addEventListener('mouseleave', leave)
        handlers.push({ el, move, leave })
      })
      ;(window as any).__igMagCleanup = () =>
        handlers.forEach(({ el, move, leave }) => {
          el.removeEventListener('mousemove', move)
          el.removeEventListener('mouseleave', leave)
        })
    }

    /* 4. 3D tilt — RAF throttled */
    if (!isCoarse) {
      const tiltEls = Array.from(document.querySelectorAll<HTMLElement>('.ig-tilt'))
      const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = []
      tiltEls.forEach(el => {
        let pending = false
        const move = (e: MouseEvent) => {
          if (pending) return; pending = true
          requestAnimationFrame(() => {
            const r = el.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`
            pending = false
          })
        }
        const leave = () => { el.style.transform = '' }
        el.addEventListener('mousemove', move, { passive: true })
        el.addEventListener('mouseleave', leave)
        handlers.push({ el, move, leave })
      })
      ;(window as any).__igTiltCleanup = () =>
        handlers.forEach(({ el, move, leave }) => {
          el.removeEventListener('mousemove', move)
          el.removeEventListener('mouseleave', leave)
        })
    }

    return () => {
      io?.disconnect()
      ;(window as any).__igSpotCleanup?.()
      ;(window as any).__igMagCleanup?.()
      ;(window as any).__igTiltCleanup?.()
    }
  }, [])
}
