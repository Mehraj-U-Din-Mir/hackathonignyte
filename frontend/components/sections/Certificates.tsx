'use client'

import { useEffect, useRef, useState } from 'react'

const CERTS = [
  { badge: 'ALL GET', icon: '📜', title: 'Participation Certificate', desc: 'Every participant gets a digitally signed, QR-verified certificate.' },
  { badge: 'WINNERS', icon: '🏆', title: 'Winner Certificate', desc: 'Premium certificates with holographic stickers and judge signatures.' },
  { badge: 'QR VERIFIED', icon: '📱', title: 'QR Digital Badges', desc: 'Scan to instantly verify certificate authenticity.' },
  { badge: 'EXCLUSIVE', icon: '⭐', title: 'Premium Access Badge', desc: 'Exclusive ignyte 2026 sticker and access badge.' },
]

export default function Certificates() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="certs" ref={ref} style={{ padding: '6rem 2rem', position: 'relative', background: 'linear-gradient(180deg,transparent,rgba(5,12,21,0.5),transparent)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">recognition</div>
          <h2 className="section-title">Certify Your <span className="grad-text">Achievement</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }} className="certs-grid">
          {CERTS.map((item, i) => (
            <div key={i}
              style={{ padding: '2.25rem 1.75rem', borderRadius: 22, background: 'linear-gradient(135deg,rgba(224,136,64,0.04),rgba(184,69,28,0.025))', border: '1px solid rgba(184,69,28,0.14)', textAlign: 'center', position: 'relative', overflow: 'hidden', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.08}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,69,28,0.28)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.28)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(184,69,28,0.14)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.14)', padding: '3px 10px', borderRadius: 50, fontSize: 9, color: '#f5c451', letterSpacing: '0.8px' }}>{item.badge}</div>
              <span style={{ fontSize: '2.75rem', marginBottom: '1rem', display: 'block' }}>{item.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '0.5rem', color: '#f5ede0', lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#a89888', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
