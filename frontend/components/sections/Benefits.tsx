'use client'

import { useEffect, useRef, useState } from 'react'

const BENEFITS = [
  { icon: '🤖', title: 'Deep Tech Workshop', sub: 'AI & ML fundamentals' },
  { icon: '🧩', title: 'Scratch Workshop', sub: 'Visual coding basics' },
  { icon: '📜', title: 'Participation Cert', sub: 'QR-verified digital cert' },
  { icon: '💡', title: 'AI Exposure', sub: 'Hands-on AI tools' },
  { icon: '🤝', title: 'Team Collaboration', sub: 'Real teamwork skills' },
  { icon: '🌐', title: 'Networking', sub: 'Meet future innovators' },
  { icon: '🎓', title: 'Mentorship', sub: 'Guided by industry pros' },
  { icon: '🔥', title: 'Innovation Challenges', sub: 'Solve real problems' },
  { icon: '🏷️', title: 'Premium Badge', sub: 'Collectible access pass' },
  { icon: '🎤', title: 'Real Presentation', sub: 'Demo to a real jury' },
]

export default function Benefits() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="benefits" ref={ref} style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">what you'll get</div>
          <h2 className="section-title">10 Reasons to <span className="grad-text">Join ignyte</span></h2>
        </div>
        {/* 5 cols → 4 cols: prevents tablet overflow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }} className="benefits-grid">
          {BENEFITS.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.6rem 1.25rem', textAlign: 'center', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)', transition: `all 0.55s cubic-bezier(0.16,1,0.3,1) ${0.04 + i * 0.04}s` }}>
              <span style={{ fontSize: '1.6rem', marginBottom: '0.9rem', display: 'block' }}>{item.icon}</span>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#f5ede0', lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#7a6f60', lineHeight: 1.5 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
