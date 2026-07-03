'use client'

/**
 * PyrelochLab
 * -----------
 * CTA card for the six-month Pyreloch Lab program.
 * Ported from ignyte-preview.html (the closing `#lab` section before footer).
 */
export default function PyrelochLab() {
  return (
    <section
      className="scroll-mt-24 border-t py-16"
      style={{ background: 'oklch(0.212 0.014 55 / 0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="card-ember spotlight mx-auto max-w-3xl rounded-2xl p-6 sm:p-8 ig-reveal">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'oklch(0.75 0.17 58 / 0.15)', color: 'var(--ember)' }}
            >
              <i data-lucide="mountain" className="size-6" />
            </span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--ig-muted)' }}>
                If two days isn&apos;t enough
              </p>
              <h3 className="mt-1 text-lg font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Pyreloch Lab
              </h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
                A six-month program, weekly sessions, where you ship a real game online. About ₹40 a day. Separate from
                Ignyte. Ask us at the event if you want to know more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
