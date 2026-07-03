'use client'

import { PARENT_CARDS } from '@/lib/ignyte-data'

/**
 * ForParents
 * ----------
 * A short pitch for parents. Ported from ignyte-preview.html `#parents` section.
 */
export default function ForParents() {
  return (
    <section id="parents" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-3xl ig-reveal">
            <span className="ig-section-label">
              <i data-lucide="sparkles" className="size-3.5" /> For parents
            </span>
            <h2
              className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              If your kid&apos;s here,{' '}
              <span className="text-gradient-ember">they&apos;re about to do something rare.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
              Build a real thing, with real teammates, against a real clock. It&apos;s loud, it&apos;s intense, and
              it&apos;s genuinely good for them. Here&apos;s the short version.
            </p>
            <div
              className="mt-8 flex items-center gap-4 rounded-2xl p-5 ig-reveal ig-reveal-delay-1"
              style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, background: 'rgba(255,255,255,0.02)' }}
            >
              <i data-lucide="shield-check" className="size-8 shrink-0" style={{ color: 'oklch(0.75 0.17 58 / 0.7)' }} />
              <p className="text-sm italic leading-relaxed" style={{ color: 'oklch(0.965 0.006 75 / 0.85)' }}>
                Watch your kid step into a role, build something with their hands, and put it on a stage. What they
                discover here, they carry forward.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PARENT_CARDS.map((c, i) => (
              <div
                key={c.title}
                className={`card-ember card-hover spotlight h-full rounded-2xl p-5 ig-reveal ig-reveal-delay-${i + 1}`}
              >
                <i data-lucide={c.icon} className="size-5" style={{ color: 'var(--ember)' }} />
                <h4 className="mt-3 text-base font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {c.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
