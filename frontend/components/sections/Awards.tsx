'use client'

import { AWARDS } from '@/lib/ignyte-data'

/**
 * Awards
 * ------
 * Six awards, all voted in the room. Ported from ignyte-preview.html
 * `#awards` section.
 */
export default function Awards() {
  return (
    <section id="awards" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> What&apos;s on the line
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Six awards. <span className="text-gradient-ember">All voted in the room.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
            No single &quot;best game&quot;. Six distinct ways to win, so the team that swung big on art has the same
            shot as the one that nailed the code.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AWARDS.map((a, i) => (
            <div
              key={a.name}
              className="ig-tilt card-ember card-hover flex h-full items-start gap-4 rounded-2xl p-5 ig-reveal in"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(180deg, oklch(0.75 0.17 58 / 0.25), oklch(0.83 0.13 86 / 0.15))',
                  color: 'var(--ember)',
                }}
              >
                <i data-lucide={a.icon} className="size-5" />
              </span>
              <div>
                <p className="text-base font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif', color: 'oklch(0.965 0.006 75)' }}>
                  {a.name}
                </p>
                <p className="mt-0.5 text-sm" style={{ color: 'var(--ig-muted)' }}>
                  {a.blurb}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mx-auto mt-8 flex max-w-4xl items-center gap-3 rounded-2xl p-5 text-left ig-reveal ig-reveal-delay-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, background: 'rgba(255,255,255,0.02)' }}
        >
          <i data-lucide="award" className="size-6 shrink-0" style={{ color: 'var(--gold)' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
            Every team takes home a certificate. Winners take home a second one.
          </p>
        </div>
      </div>
    </section>
  )
}
