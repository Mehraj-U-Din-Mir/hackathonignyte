'use client'

import { useEffect, useRef, useState } from 'react'

const RULES = [
  { n: '01', title: 'Who Can Participate', desc: 'Students from Classes 6th to 12th are eligible. All streams welcome.' },
  { n: '02', title: 'Team Composition', desc: 'Each team must have 3 to 4 students. Interdisciplinary teams encouraged.' },
  { n: '03', title: 'School Quota', desc: 'Maximum 1–3 teams per school, cap of 5–10 students per school total.' },
  { n: '04', title: 'Registration Fee', desc: '₹500 per student via UPI. Upload transaction screenshot during registration.' },
  { n: '05', title: 'Original Projects Only', desc: 'All projects must be 100% original, built from scratch during the event.' },
  { n: '06', title: 'Mandatory Registration', desc: 'Pre-registration is mandatory. Entry without approved QR will not be permitted.' },
]

export default function Rules() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="rules" ref={ref} style={{ padding: '6rem 2rem', position: 'relative', background: 'linear-gradient(180deg,transparent,rgba(5,12,21,0.5),transparent)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">participation rules</div>
          <h2 className="section-title">Rules &amp; <span className="grad-text">Eligibility</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }} className="rules-grid">
          {RULES.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.75rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.07}s`, cursor: 'default' }}>
              <div style={{ fontSize: 11, color: '#b8451c', letterSpacing: 2, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(184,69,28,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{r.n}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f5ede0', lineHeight: 1.35 }}>{r.title}</h3>
              <p style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
