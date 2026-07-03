'use client'

import { OUTCOMES } from '@/lib/ignyte-data'

/**
 * Outcomes
 * --------
 * "What you walk away with" — six skills beyond the game itself.
 * Ported from ignyte-preview.html (the unmarked `#outcomes-grid` section).
 */
export default function Outcomes() {
  return (
    <section
      className="scroll-mt-24 border-y py-20 sm:py-28"
      style={{ background: 'oklch(0.212 0.014 55 / 0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> What you walk away with
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Six things you&apos;ll keep. <span className="text-gradient-ember">Beyond the game.</span>
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OUTCOMES.map((o, i) => (
            <div
              key={o.label}
              className="card-ember card-hover spotlight flex items-center gap-3 rounded-2xl p-5 ig-reveal in"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'oklch(0.75 0.17 58 / 0.15)', color: 'var(--ember)' }}
              >
                <i data-lucide={o.icon} className="size-5" />
              </span>
              <p className="text-sm font-medium leading-snug" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
                {o.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
