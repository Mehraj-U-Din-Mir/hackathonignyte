'use client'

/**
 * Mission
 * -------
 * "Born in the valley. Built for it." — why Pyreloch runs the jam.
 * Ported from the ignyte-preview.html `#mission` section.
 */

export default function Mission() {
  return (
    <section
      id="mission"
      className="scroll-mt-24 border-y"
      style={{
        background: 'oklch(0.212 0.014 55 / 0.4)',
        borderColor: 'rgba(255,255,255,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="max-w-3xl ig-reveal">
            <span className="ig-section-label">
              <i data-lucide="sparkles" className="size-3.5" /> Why Pyreloch runs this
            </span>
            <h2
              className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Born in the valley.{' '}
              <span className="text-gradient-ember">Built for it.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
              Pyreloch is a video game company from Kashmir. We make games, and we grow the people who make them.
            </p>
          </div>

          <div className="card-ember spotlight rounded-2xl p-6 sm:p-8 ig-reveal ig-reveal-delay-2">
            <p className="text-base leading-relaxed" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
              The valley is full of storytellers, artists and coders. Most of them never get the chance to turn that into
              a career. Pyreloch exists to change that. We train. We hire. We build a path from a kid who likes drawing
              to a professional who ships games.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
              Ignyte is where a lot of them start. You show up, you find your role, you build something with your hands.
              If it sticks, there&apos;s a road from here into the industry. If it doesn&apos;t, you still walked away with a
              game you made.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="ig-pill">Indigenous</span>
              <span className="ig-pill">Kashmir-made</span>
              <span className="ig-pill">Training to employment</span>
              <span className="ig-pill">Studio-run</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
