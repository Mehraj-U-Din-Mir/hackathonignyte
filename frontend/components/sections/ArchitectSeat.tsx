'use client'

import { ARCHITECT_CARDS } from '@/lib/ignyte-data'

/**
 * ArchitectSeat
 * -------------
 * Spotlight for "The Architect" role — engineering work in service of
 * the team's game. Ported from ignyte-preview.html (the unmarked
 * "Architect seat" section between `#tools` and `#awards`).
 */
export default function ArchitectSeat() {
  return (
    <section
      className="scroll-mt-24 border-y py-20 sm:py-28"
      style={{ background: 'oklch(0.212 0.014 55 / 0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> The Architect seat
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Love code, not gameplay?{' '}
            <span className="text-gradient-loch">Build everything around the game.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
            The Architect seat is for you. Real engineering, in service of your team&apos;s game.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHITECT_CARDS.map((c, i) => (
            <div
              key={c.title}
              className={`card-ember card-hover spotlight h-full rounded-2xl p-5 ig-reveal ig-reveal-delay-${(i % 3) + 1}`}
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: 'oklch(0.6 0.1 158 / 0.15)', color: 'var(--loch)' }}
              >
                <i data-lucide={c.icon} className="size-5" />
              </span>
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
    </section>
  )
}
