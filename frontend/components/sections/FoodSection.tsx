'use client'

import { useEffect, useRef, useState } from 'react'

const EXP = [
  { icon: '🍕', title: 'Snacks & Refreshments', desc: 'Keep your energy high with curated snacks and beverages throughout both event days.' },
  { icon: '🎮', title: 'Gaming Corner', desc: 'Take a break and challenge fellow hackers to fun mini-games between sessions.' },
  { icon: '🌐', title: 'Networking Lounge', desc: 'Connect with participants, mentors, and industry guests in a relaxed environment.' },
  { icon: '📸', title: 'Photo Booth', desc: 'Capture your ignyte memories with a premium event photo station.' },
]

export default function FoodSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="food" ref={ref} style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">the experience</div>
          <h2 className="section-title">More Than Just <span className="grad-text">Hacking</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }} className="food-grid">
          {EXP.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.08}s` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: '0.5rem', color: '#f5ede0', lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
