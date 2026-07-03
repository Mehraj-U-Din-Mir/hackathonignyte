'use client'

/**
 * TheJam
 * ------
 * Two-day schedule. Day 1 starts, Day 2 ships.
 * Ported from ignyte-preview.html `#jam` section.
 */

export default function TheJam() {
  return (
    <section
      id="jam"
      className="scroll-mt-24 border-y py-20 sm:py-28"
      style={{ background: 'oklch(0.212 0.014 55 / 0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> The two days
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Day one you start. <span className="text-gradient-ember">Day two you ship.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
            No filler, no warm-up rounds. The clock starts and you&apos;re building.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* Day One */}
          <div className="card-ember card-hover spotlight h-full rounded-2xl p-7 ig-reveal ig-reveal-delay-1">
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 items-center justify-center rounded-xl font-bold text-lg"
                style={{ background: 'oklch(0.75 0.17 58 / 0.15)', color: 'var(--ember)', fontFamily: '"Space Grotesk", sans-serif' }}
              >
                01
              </span>
              <h3 className="text-xl font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Day One
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
              It opens with an interactive lecture on where computer science can actually take you — the paths beyond
              just &quot;coding.&quot; Then the theme drops. You lock roles with your team, sketch a concept, and start
              building. By sundown something&apos;s moving on a screen.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm" style={{ color: 'oklch(0.965 0.006 75 / 0.85)' }}>
              <li className="tl-item">
                <span className="font-medium">Morning</span> · Interactive talk: the roads through CS
              </li>
              <li className="tl-item">
                <span className="font-medium">Midday</span> · Theme revealed at kickoff
              </li>
              <li className="tl-item">
                <span className="font-medium">Afternoon</span> · Lock your roles and scope
              </li>
              <li className="tl-item">
                <span className="font-medium">Nightfall</span> · First playable on a screen
              </li>
            </ul>
          </div>

          {/* Day Two */}
          <div className="card-ember card-hover spotlight h-full rounded-2xl p-7 ig-reveal ig-reveal-delay-2">
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 items-center justify-center rounded-xl font-bold text-lg"
                style={{ background: 'oklch(0.83 0.13 86 / 0.15)', color: 'var(--gold)', fontFamily: '"Space Grotesk", sans-serif' }}
              >
                02
              </span>
              <h3 className="text-xl font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                Day Two
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--ig-muted)' }}>
              You polish. You break things and fix them. You cut whatever you can&apos;t finish. Then you put your game on
              the big screen, play everyone else&apos;s, and find out who takes the awards home.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm" style={{ color: 'oklch(0.965 0.006 75 / 0.85)' }}>
              <li className="tl-item gold">
                <span className="font-medium">Morning</span> · Polish, test, cut
              </li>
              <li className="tl-item gold">
                <span className="font-medium">Afternoon</span> · Showcase on the big screen
              </li>
              <li className="tl-item gold">
                <span className="font-medium">Evening</span> · Awards, voted by the room
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-6 flex flex-col items-start gap-3 rounded-2xl p-5 sm:flex-row sm:items-center ig-reveal ig-reveal-delay-3"
          style={{
            borderColor: 'oklch(0.75 0.17 58 / 0.25)',
            borderWidth: 1,
            background: 'oklch(0.75 0.17 58 / 0.06)',
          }}
        >
          <i data-lucide="sparkles" className="size-5 shrink-0" style={{ color: 'var(--ember)' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
            The theme stays sealed until kickoff. You&apos;ll find out the same moment everyone else does.
          </p>
        </div>
      </div>
    </section>
  )
}
