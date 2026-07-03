'use client'

import { useEffect, useRef, useState } from 'react'

export default function Prizes() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const delay = (n: number) => `all 0.75s cubic-bezier(0.16,1,0.3,1) ${n}s`

  return (
    <section id="prizes" ref={ref} style={{ padding: '6rem 2rem', position: 'relative', background: 'linear-gradient(180deg,transparent,rgba(5,12,21,0.7),transparent)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">prize pool</div>
          <h2 className="section-title">Win Big. <span className="grad-text-gold">Earn Bigger.</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '1.5rem', alignItems: 'end' }} className="prizes-grid">
          {/* Runner Up */}
          <div className="glass-card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: delay(0.08) }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🥈</span>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 2.5, color: '#7a6f60', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Runner Up</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f5ede0' }}>2nd Place</div>
            <p style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65 }}>Winner trophy, premium certificates, event merchandise & special recognition.</p>
            <div style={{ background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.15)', borderRadius: 12, padding: '11px 16px', fontSize: 11, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", display: 'inline-block' }}>🎓 Certificate from Ignyte</div>
            <div style={{ background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.15)', borderRadius: 12, padding: '11px 16px', fontSize: 11, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", display: 'inline-block' }}>🎓 Certificate from CoveIQ</div>
          </div>

          {/* Champion */}
          <div style={{ position: 'relative', padding: '2.75rem 1.75rem', borderRadius: 24, background: 'linear-gradient(135deg,rgba(245,196,81,0.06),rgba(255,180,0,0.02))', border: '1px solid rgba(245,196,81,0.2)', textAlign: 'center', overflow: 'hidden', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.96)', transition: delay(0.16), boxShadow: '0 0 50px rgba(245,196,81,0.07),inset 0 1px 0 rgba(245,196,81,0.1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#f5c451,#f5a623,#f5c451)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
            <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#f5c451,#f5a623)', color: '#000', fontSize: 10, fontWeight: 700, padding: '4px 16px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(245,196,81,0.28)' }}>★ GRAND PRIZE</div>
            <span style={{ fontSize: '4rem', display: 'block', marginTop: '0.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(255,195,0,0.45))' }}>🏆</span>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 2.5, color: '#f5c451', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Champion</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f5c451' }}>1st Place</div>
            <p style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65, marginBottom: '1.25rem' }}>FREE 4-Month AI Training Vouchers + Grand Trophy + Premium Certificates</p>
            <div style={{ background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.15)', borderRadius: 12, padding: '11px 16px', fontSize: 11, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", display: 'inline-block' }}>🎓 Money and Course Vouchers </div>
            <div style={{ background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.15)', borderRadius: 12, padding: '11px 16px', fontSize: 11, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", display: 'inline-block' }}>🎓 Awards from Ignyte</div>
            <div style={{ background: 'rgba(245,196,81,0.08)', border: '1px solid rgba(245,196,81,0.15)', borderRadius: 12, padding: '11px 16px', fontSize: 11, color: '#f5c451', fontFamily: "'JetBrains Mono',monospace", display: 'inline-block' }}>🎓 Internship Oppertunity at CoveIQ</div>          
          </div>

          {/* Special */}
          <div className="glass-card" style={{ padding: '2.25rem 1.75rem', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: delay(0.24) }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏅</span>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 2.5, color: '#7a6f60', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Special</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f5ede0' }}>Awards</div>
            <p style={{ fontSize: 13, color: '#a89888', lineHeight: 1.65 }}>Best Innovation, Best UI/UX & Jury Special Mention with exclusive prizes.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
