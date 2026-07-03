'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#rules', label: 'Rules' },
  { href: '#benefits', label: 'Workshops' },
  { href: '#prizes', label: 'Prizes' },
  // { href: '#roles', label: 'Roles' },
  // { href: '#jam', label: 'The Jam' },
  { href: '#awards', label: 'Awards' },
  // { href: '#faq', label: 'FAQ' },
  { href: '#register', label: 'Register' },
  {href :'/admin', label:'Admin'},
]

// Opens the original ignyte-preview.html (saved in /public) in a new tab.
const PREVIEW_HREF = '/ignyte-preview.html'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
  }, [])

  // Reset the magnetic transform. Callers can pass an `onLeave` callback to
  // also reset colours / borders etc. — this avoids duplicate `onMouseLeave`
  // attributes on the same JSX element.
  const makeMagneticLeave = useCallback(
    (onLeave?: (el: HTMLAnchorElement) => void) =>
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.transform = 'translate(0, 0)'
        onLeave?.(e.currentTarget)
      },
    [],
  )

  // Legacy name kept for any caller that just wants the transform reset.
  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: scrolled ? 16 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: scrolled ? 'min(95%, 1200px)' : '100%',
          maxWidth: scrolled ? '1200px' : 'none',
          zIndex: 1000,
          padding: scrolled ? '12px 32px' : '20px 48px',
          background: scrolled ? 'rgba(26, 20, 16, 0.85)' : 'rgba(26, 20, 16, 0.3)',
          backdropFilter: scrolled ? 'blur(30px) saturate(150%)' : 'blur(20px) saturate(120%)',
          WebkitBackdropFilter: scrolled ? 'blur(30px) saturate(150%)' : 'blur(20px) saturate(120%)',
          borderRadius: scrolled ? '20px' : '0',
          border: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(224, 136, 64, 0.05)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #e08840, #f5c451)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: '-0.5px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#logoGrad)" />
            <path d="M2 17L12 22L22 17" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <defs>
              <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e08840" />
                <stop offset="1" stopColor="#f5c451" />
              </linearGradient>
            </defs>
          </svg>
          ignyte 2026
        </Link>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map(({href, label}) => (
            <a
              key={href}
              href={href}
              onMouseMove={handleMagneticMove}
              onMouseLeave={makeMagneticLeave(el => {
                if (activeSection !== href.replace('#', '')) {
                  el.style.color = '#a89888'
                  el.style.background = 'transparent'
                }
              })}
            >
              {label}
            </a>
          ))}

          <Link
            href="/submit"
            onMouseMove={handleMagneticMove}
            onMouseLeave={makeMagneticLeave(el => {
              el.style.borderColor = 'rgba(255,255,255,0.08)'
              el.style.color = '#a89888'
            })}
            style={{
              color: '#a89888',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.3s ease',
              marginLeft: 4,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(224, 136, 64, 0.2)'
              e.currentTarget.style.color = '#e08840'
            }}
          >
            Submit
          </Link>

          <a
            href={PREVIEW_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMagneticMove}
            onMouseLeave={makeMagneticLeave(el => {
              el.style.borderColor = 'rgba(255,180,0,0.18)'
              el.style.color = '#a89888'
              el.style.background = 'rgba(255,180,0,0.04)'
            })}
            style={{
              color: '#a89888',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,180,0,0.18)',
              transition: 'all 0.3s ease',
              marginLeft: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,180,0,0.04)',
            }}
            title="Open the original ignyte-preview.html (ember/loch/gold design) in a new tab"
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,180,0,0.45)'
              e.currentTarget.style.color = '#f5a623'
              e.currentTarget.style.background = 'rgba(255,180,0,0.08)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C7.6 2 4 5.6 4 10c0 4.4 8 12 8 12s8-7.6 8-12c0-4.4-3.6-8-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Preview
          </a>

          <a
            href="#register"
            onMouseMove={handleMagneticMove}
            onMouseLeave={makeMagneticLeave(el => {
              el.style.boxShadow = '0 0 25px rgba(224, 136, 64, 0.2)'
              el.style.transform = 'translateY(0)'
            })}
            style={{
              background: 'linear-gradient(135deg, #e08840, #b8451c)',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 24px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              boxShadow: '0 0 25px rgba(224, 136, 64, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              marginLeft: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(224, 136, 64, 0.35)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            Register
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#f5ede0',
            cursor: 'pointer',
            padding: 8,
          }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            background: 'rgba(26, 20, 16, 0.95)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            padding: 24,
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#f5ede0',
                textDecoration: 'none',
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={() => setMobileOpen(false)}
            className="btn-primary"
            style={{ marginTop: 16 }}
          >
            Register Now
          </a>
        </div>
      )}
    </>
  )
}