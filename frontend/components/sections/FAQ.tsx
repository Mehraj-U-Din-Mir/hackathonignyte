'use client'

import { FAQS } from '@/lib/ignyte-data'

/**
 * FAQ
 * ---
 * Accordion list of common questions.
 * Ported from ignyte-preview.html `#faq` section.
 *
 * Uses native <details>/<summary> so it works without JS, with the
 * `.ig-acc` CSS hooks defined in globals.css for the chevron + tint.
 */
export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> Questions
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            The stuff you&apos;re <span className="text-gradient-ember">probably wondering.</span>
          </h2>
        </div>

        <div
          className="mx-auto mt-10 max-w-3xl rounded-2xl px-5 ig-reveal ig-reveal-delay-1"
          style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, background: 'rgba(255,255,255,0.02)' }}
        >
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="ig-acc"
              style={i === FAQS.length - 1 ? {} : { borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <summary
                className="flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-base font-medium transition-colors"
                style={{ color: 'oklch(0.965 0.006 75)' }}
              >
                <span className="ig-acc-q">{f.q}</span>
                <i
                  data-lucide="chevron-down"
                  className="ig-acc-chevron size-4 shrink-0 translate-y-0.5"
                  style={{ color: 'var(--ig-muted)' }}
                />
              </summary>
              <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
