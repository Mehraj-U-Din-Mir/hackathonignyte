'use client'

import { useEffect, useRef, useState } from 'react'

const FEATURES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" /><path d="M12 8v4l3 3" /></svg>,
    title: 'AI-Powered Workshops',
    desc: 'Hands-on sessions with real AI tools. Build ML projects — no prior experience needed.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: 'Team Collaboration',
    desc: 'Work in teams of 3–4, solve real-world problems, present to industry judges.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    title: 'Innovation Challenges',
    desc: 'Tackle curated problem statements designed to push your creativity to the limit.',
  },
]

const TAGS = ['AI Innovation', 'Beginner Friendly', 'Compete & Win', 'Networking', 'Certificates', 'Mentorship']

export default function About() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.12 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="about" ref={ref} style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(184,69,28,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }} className="about-grid">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">about the event</div>
          <h2 className="section-title">Where <span className="grad-text">Future Tech</span><br />Leaders Are Born</h2>
          <p style={{ color: '#a89888', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.75rem', maxWidth: 500 }}>
            ignyte 2026 is a premier school hackathon for students from Class 8 to 12. Whether you're a complete beginner or a budding developer — this is YOUR stage to build, create, and innovate.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TAGS.map((tag, i) => (
              <span key={tag} style={{ padding: '7px 16px', background: 'rgba(224,136,64,0.04)', border: '1px solid rgba(224,136,64,0.10)', borderRadius: 50, fontSize: 12, fontWeight: 500, color: '#a89888', transition: 'all .25s ease', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transitionDelay: `${0.3 + i * 0.05}s` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,136,64,0.28)'; e.currentTarget.style.background = 'rgba(224,136,64,0.07)'; e.currentTarget.style.color = '#f5c451' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(224,136,64,0.10)'; e.currentTarget.style.background = 'rgba(224,136,64,0.04)'; e.currentTarget.style.color = '#a89888' }}
              >{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s`, cursor: 'default' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,rgba(224,136,64,0.12),rgba(184,69,28,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e08840', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: 4, color: '#f5ede0', lineHeight: 1.3 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
