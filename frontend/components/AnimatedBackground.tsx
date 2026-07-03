'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; color: string
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []
    let mouseX = 0, mouseY = 0, isMouseActive = false
    let rafMousePending = false

    const COLORS = ['rgba(224,136,64,', 'rgba(184,69,28,', 'rgba(245,196,81,', 'rgba(74,155,142,']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      // Reduced 80 → 40: halves draw calls and connection checks (O(n²) → 4× faster)
      const count = Math.min(40, Math.floor(window.innerWidth / 28))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.45 + 0.08,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Connection distance 150 → 90 px: cuts pair checks by ~64% (90²/150² ≈ 0.36)
      const CONNECT_DIST = 90
      const CD2 = CONNECT_DIST * CONNECT_DIST

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < CD2) {
            const dist = Math.sqrt(d2)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(224,136,64,${(1 - dist / CONNECT_DIST) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.opacity + ')'
        ctx.fill()

        if (isMouseActive) {
          const dx = mouseX - p.x, dy = mouseY - p.y
          const d2 = dx * dx + dy * dy
          if (d2 < 25600) { // 160²
            const dist = Math.sqrt(d2)
            const force = (160 - dist) / 160
            p.vx -= (dx / dist) * force * 0.015
            p.vy -= (dy / dist) * force * 0.015
          }
        }

        p.x += p.vx; p.y += p.vy
        p.vx *= 0.99; p.vy *= 0.99

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })

      animId = requestAnimationFrame(draw)
    }

    // RAF-gated: prevents per-pixel state updates
    const handleMouse = (e: MouseEvent) => {
      if (rafMousePending) return
      rafMousePending = true
      requestAnimationFrame(() => {
        mouseX = e.clientX; mouseY = e.clientY; isMouseActive = true
        rafMousePending = false
      })
    }
    const handleLeave = () => { isMouseActive = false }

    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { resize(); createParticles() }, 150)
    }

    resize(); createParticles(); draw()
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', handleMouse, { passive: true })
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      {/* 4 orbs → 2, blur 100px → 60px in globals.css */}
      <div className="bg-mesh">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div className="bg-grid" />
      <div className="bg-vignette" />
      <canvas ref={canvasRef} className="particle-canvas" />
    </>
  )
}
