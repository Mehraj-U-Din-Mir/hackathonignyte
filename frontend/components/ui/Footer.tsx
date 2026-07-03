'use client'

import Link from 'next/link'

const FOOTER_LINKS = [
  // { href: '#about', label: 'About' },
  // { href: '#rules', label: 'Rules' },
  // { href: '#benefits', label: 'Workshops' },
  // { href: '#prizes', label: 'Prizes' },
  // { href: '#roles', label: 'Roles' },
  // { href: '#jam', label: 'The Jam' },
  // { href: '#awards', label: 'Awards' },
  // { href: '#faq', label: 'FAQ' },
  // { href: '#register', label: 'Register' },
  // { href: '/submit', label: 'Submit Project' },
  // { href: '/admin', label: 'Admin' },
  // { href: '/ignyte-preview.html', label: 'Original HTML Preview ↗' },
]

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '5rem 2rem 3rem',
        background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.8), rgba(26, 20, 16, 1))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 200,
          background: 'radial-gradient(ellipse, rgba(224, 136, 64, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            gap: '3rem',
          }}
          className="footer-top"
        >
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <Link
              href="/"
              style={{
                fontFamily: "'consolas', monospace",
                fontSize: '1.5rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #e08840, #b8451c, #f5c451)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: '1rem',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#footerLogoGrad)" />
                <path d="M2 17L12 22L22 17" stroke="url(#footerLogoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="url(#footerLogoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                <defs>
                  <linearGradient id="footerLogoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e08840" />
                    <stop offset="1" stopColor="#f5c451" />
                  </linearGradient>
                </defs>
              </svg>
              ignyte 2026
            </Link>
            <p
              style={{
                color: '#f5c451',
                fontFamily: "'consolas', monospace",
                fontWeight: 600,
                marginBottom: '0.8rem',
                fontSize: 15,
              }}
            >
              Future Innovators Hackathon
            </p>
            <p
              style={{
                color: '#7a6f60',
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              The premier school hackathon — where tomorrow's tech leaders are made today.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {['Twitter', 'Instagram', 'LinkedIn'].map(name => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7a6f60',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(224, 136, 64, 0.2)'
                    e.currentTarget.style.color = '#e08840'
                    e.currentTarget.style.background = 'rgba(224, 136, 64, 0.04)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = '#7a6f60'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {name === 'Twitter' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {name === 'Instagram' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  )}
                  {name === 'LinkedIn' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontFamily: "'consolas', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: '#f5ede0',
                marginBottom: '1.2rem',
                letterSpacing: '0.5px',
              }}
            >
              {/* Navigation */}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FOOTER_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: '#7a6f60',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#f5c451'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#7a6f60'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "'consolas', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: '#f5ede0',
                marginBottom: '1.2rem',
                letterSpacing: '0.5px',
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href="mailto:meermehraj25@gmail.com"
                style={{
                  color: '#7a6f60',
                  textDecoration: 'none',
                  fontSize: 14,
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f5c451' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#7a6f60' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                meermehraj25@gmail.com
              </a>
              <span style={{ color: '#5a4f44', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Kashmir, India
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            marginBottom: '2rem',
          }}
        />

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          className="footer-bottom"
        >
          <p style={{ fontSize: 12, color: 'rgba(209, 198, 181, 0.5)' }}>
            © 2026 ignyte. All rights reserved.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(190, 184, 175, 0.5)' }}>
            Made with ❤️ By Mehraj U Din Mir
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ fontSize: 12, color: 'rgba(122, 111, 96, 0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7a6f60'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(202, 194, 181, 0.5)'}
            >
              Privacy Policy
            </a>
            <a href="#" style={{ fontSize: 12, color: 'rgba(201, 189, 172, 0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#b4ab9f'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(182, 172, 158, 0.5)'}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}