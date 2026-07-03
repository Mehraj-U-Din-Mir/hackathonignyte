'use client'

import { useEffect, useState, useRef } from 'react'

const EVENT_DATE = new Date('2026-08-20T09:00:00')
const pad = (n: number) => String(n).padStart(2, '0')

export default function Hero() {
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [visible, setVisible] = useState(false)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisible(true)
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now()
      if (diff <= 0) return
      setCd({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* Ring parallax — RAF-throttled, flag always reset before null guard */
  useEffect(() => {
    let rafPending = false
    const onMove = (e: MouseEvent) => {
      if (rafPending) return
      rafPending = true
      const cx = e.clientX, cy = e.clientY
      requestAnimationFrame(() => {
        rafPending = false          // always reset first
        if (!ringRef.current) return
        const r = ringRef.current.getBoundingClientRect()
        const rx = (cy - (r.top + r.height / 2)) * 0.008
        const ry = (cx - (r.left + r.width / 2)) * 0.008
        ringRef.current.style.transform = `perspective(1000px) rotateX(${-rx}deg) rotateY(${ry}deg)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const cdItems = [
    { n: cd.days, l: 'Days' }, { n: cd.hours, l: 'Hours' },
    { n: cd.minutes, l: 'Minutes' }, { n: cd.seconds, l: 'Seconds' },
  ]

  const stats = [
    { n: '200+', l: 'Participants' }, { n: '2', l: 'Day Event' }, { n: '₹500', l: 'Per Student' },
  ]

  const cards = [
    { label: 'AI WORKSHOP', value: 'Machine Learning', top: '5%', left: '-5%' },
    { label: 'PRIZE POOL', value: '4-Month AI Course', top: '25%', right: '-12%' },
    { label: 'PARTICIPANTS', value: '200+ Students', bottom: '25%', left: '-12%' },
    { label: 'CERTIFICATE', value: 'QR Verified', bottom: '5%', right: '-5%' },
    // { label: 'Internship Oppertunity', value: '', bottom: '25%', right: '-15%' },
  ]

  const tx = (on: boolean) => `${on ? 'translateY(0)' : 'translateY(30px)'}`
  const op = (on: boolean) => on ? 1 : 0

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{ maxWidth: 1260, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}
        className="hero-grid"
      >
        {/* ── Left ── */}
        <div style={{ opacity: op(visible), transform: tx(visible), transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(224,136,64,0.06)', border: '1px solid rgba(224,136,64,0.15)', borderRadius: 50, padding: '8px 18px', fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: '#f5c451', marginBottom: '1.6rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e08840', boxShadow: '0 0 8px #e08840', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
            AUGUST 2026 · KASHMIR EDITION
          </div>

          {/* Headline — lineHeight fixed 0.95 → 1.05 */}
          <h1 style={{ fontFamily: "'consolas',monospace", fontSize: 'clamp(3rem,6.5vw,5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1rem' }}>
            <span className="grad-text">Ignyte</span><br />Hackathon 2026
            <br />
            <span style={{ fontSize: '0.38em', color: '#7a6f60', fontWeight: 300, letterSpacing: '4px', display: 'block', marginTop: 6 }}>2026</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, marginBottom: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            No Coding Experience Needed
          </p>
          <p style={{ fontSize: '1rem', color: '#a89888', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
            Build. Learn. Innovate. Compete.<br />The premier school hackathon for future innovators — where ideas become reality.
          </p>

          {/* Countdown */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {cdItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="countdown-box">
                  <div style={{ fontFamily: "'consolas',monospace", fontSize: '1.6rem', fontWeight: 800, color: '#f5c451', lineHeight: 1 }}>{pad(item.n)}</div>
                  <div style={{ fontSize: 9, color: '#7a6f60', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4, fontFamily: "'JetBrains Mono',monospace" }}>{item.l}</div>
                </div>
                {i < 3 && <span style={{ fontFamily: "'consolas',monospace", fontSize: '1.4rem', color: 'rgba(224,136,64,0.22)', fontWeight: 300 }}>:</span>}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '2.5rem' }}>
            <a href="#register" className="btn-primary">
              Register Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#prizes" className="btn-secondary">View Prizes</a>
            <a href="/submit" className="btn-ghost">Submit Project</a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.8rem', maxWidth: 400 }}>
            {stats.map((s, i) => (
              <div
                key={i}
                style={{ textAlign: 'center', padding: '1rem 0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, transition: 'border-color .3s ease, background .3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,136,64,0.15)'; e.currentTarget.style.background = 'rgba(224,136,64,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              >
                <div style={{ fontFamily: "'consolas',monospace", fontSize: '1.8rem', fontWeight: 800 }} className="grad-text">{s.n}</div>
                <div style={{ fontSize: 11, color: '#7a6f60', marginTop: 3, letterSpacing: '0.3px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Visual ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', opacity: op(visible), transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)', transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s' }}>
          <div ref={ringRef} style={{ position: 'relative', width: 320, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d', transition: 'transform .12s ease-out' }}>

            {/* Single spinning ring */}
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'conic-gradient(from 0deg, #e08840, #b8451c, #f5c451, #e08840)', animation: 'spin-slow 14s linear infinite', opacity: 0.85 }} />

            {/* Inner disc */}
            <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#25201b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 14px rgba(224,136,64,0.3))' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#hg1)" />
                <path d="M2 17l10 5 10-5" stroke="url(#hg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="url(#hg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
                <defs>
                  <linearGradient id="hg1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e08840" /><stop offset=".5" stopColor="#b8451c" /><stop offset="1" stopColor="#f5c451" />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontFamily: "'consolas',monospace", fontSize: '0.65rem', fontWeight: 700, color: '#f5c451', letterSpacing: '3px' }}>INNOVATE</span>
            </div>

            {/* Floating info cards — solid dark bg, no backdropFilter */}
            {cards.map((card, i) => (
              <div
                key={i}
                style={{ position: 'absolute', ...(card as any), background: 'rgba(30,24,18,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '10px 16px', fontSize: 12, whiteSpace: 'nowrap', animation: `float ${4 + i * 0.5}s ease-in-out ${i * 0.6}s infinite`, transition: 'border-color .3s ease, background .3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,136,64,0.2)'; e.currentTarget.style.background = 'rgba(36,28,20,0.95)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(30,24,18,0.92)' }}
              >
                <div style={{ fontSize: 9, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", marginBottom: 3, letterSpacing: '1px' }}>{card.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f5ede0' }}>{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: visible ? 0.45 : 0, transition: 'opacity 1s ease 1.5s' }}>
        <span style={{ fontSize: 9, color: '#7a6f60', letterSpacing: '2px', fontFamily: "'JetBrains Mono',monospace" }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(224,136,64,0.5), transparent)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
