'use client'

import { useState } from 'react'
import { TOOLS, TOOL_FILTERS } from '@/lib/ignyte-data'

/**
 * ToolsSection
 * ------------
 * Marquee of all tools + a filterable grid.
 * Ported from ignyte-preview.html `#tools` section.
 */
export default function ToolsSection() {
  const [filter, setFilter] = useState<string>('all')
  const list = filter === 'all' ? TOOLS : TOOLS.filter(t => t.filter === filter)
  const marqueeItems = [...TOOLS, ...TOOLS] // duplicate for seamless loop

  return (
    <section id="tools" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> The stack
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Real tools. <span className="text-gradient-ember">The ones studios use.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
            Free, open, or student-friendly. Bring what you know, try what you don&apos;t. This is the same kit
            professional teams ship with.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap items-center gap-2 ig-reveal ig-reveal-delay-1">
          <span className="mr-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ig-muted)' }}>
            Show
          </span>
          {TOOL_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`ig-chip rounded-full px-3 py-1 text-xs ${filter === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((t, idx) => (
            <div
              key={`${t.name}-${idx}`}
              className="card-ember card-hover spotlight flex items-center gap-3 rounded-xl p-4 ig-reveal in"
              style={{ transitionDelay: `${idx * 0.03}s` }}
            >
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{ background: 'oklch(0.75 0.17 58 / 0.15)', color: 'var(--ember)' }}
              >
                <i data-lucide={t.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: 'oklch(0.965 0.006 75)' }}>
                  {t.name}
                </p>
                <p className="truncate text-xs" style={{ color: 'var(--ig-muted)' }}>
                  {t.kind}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee strip */}
      <div
        className="mt-16 border-y py-4 marquee-wrap"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'oklch(0.212 0.014 55 / 0.4)' }}
      >
        <div className="mask-fade-x relative overflow-hidden">
          <div
            className="animate-marquee-x flex w-max items-center gap-8 pr-8"
            style={{ ['--marquee-dur' as string]: '60s' }}
          >
            {marqueeItems.map((t, i) => (
              <span
                key={`${t.name}-marquee-${i}`}
                className="flex shrink-0 items-center gap-2 text-sm"
                style={{ color: 'var(--ig-muted)' }}
              >
                <i data-lucide={t.icon} className="size-4" style={{ color: 'oklch(0.75 0.17 58 / 0.8)' }} />
                <span className="font-medium" style={{ color: 'oklch(0.965 0.006 75 / 0.8)' }}>
                  {t.name}
                </span>
                <span className="text-xs" style={{ color: 'oklch(0.715 0.016 70 / 0.7)' }}>
                  · {t.kind}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
