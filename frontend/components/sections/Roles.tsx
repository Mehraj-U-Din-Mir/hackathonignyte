'use client'

import { useState } from 'react'
import {
  ROLES,
  ROLE_FILTERS,
  QUIZ,
  CAT_META,
  CAT_ICON,
  CAT_LABEL,
  QUIZ_ROLE_MAP,
  type Role,
  type RoleCategory,
  type QuizAnswer,
} from '@/lib/ignyte-data'

/**
 * Roles + Quiz
 * ------------
 * Ported from ignyte-preview.html `#roles` section.
 * Nine roles in a filterable grid; clicking a role expands the detail.
 * Below the grid is a 6-question quiz that recommends a category.
 */

type FilterId = 'all' | RoleCategory

export default function Roles() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const list = filter === 'all' ? ROLES : ROLES.filter(r => r.cat === filter)

  return (
    <section id="roles" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl ig-reveal">
          <span className="ig-section-label">
            <i data-lucide="sparkles" className="size-3.5" /> Find your role
          </span>
          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Nine roles. <span className="text-gradient-ember">Find yours.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--ig-muted)' }}>
            Tap a role to see what it does, or take the quiz and let us point you toward the ones that fit how you think.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap items-center gap-2 ig-reveal ig-reveal-delay-1">
          <span className="mr-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ig-muted)' }}>
            Filter
          </span>
          {ROLE_FILTERS.map(f => {
            const isActive = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FilterId)}
                className={`ig-chip rounded-full px-3 py-1 text-xs ${isActive ? 'active' : ''}`}
              >
                {f.icon && <i data-lucide={f.icon} className="size-3 inline -mt-0.5 mr-1" />}
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="mt-12 space-y-6">
          <div id="roles-grid" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r, idx) => (
              <RoleCard
                key={r.id}
                role={r}
                open={openId === r.id}
                onClick={() => setOpenId(openId === r.id ? null : r.id)}
                delay={idx * 0.04}
              />
            ))}
          </div>

          <div className="mx-auto max-w-2xl ig-reveal">
            <div className="card-ember spotlight rounded-2xl p-5 sm:p-6">
              <Quiz />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RoleCard({ role, open, onClick, delay }: { role: Role; open: boolean; onClick: () => void; delay: number }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-2 rounded-xl p-4 text-left transition-all hover:bg-white/[0.03] ig-reveal in"
      style={{
        transitionDelay: `${delay}s`,
        borderColor: open ? 'transparent' : 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        background: open ? 'rgba(255,255,255,0.04)' : 'transparent',
        boxShadow: open ? `0 0 0 1px ${role.tint}, 0 0 28px -8px ${role.glow}` : 'none',
      }}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span
          className="flex size-10 items-center justify-center rounded-lg"
          style={{ background: `${role.tint}1a`, color: role.tint }}
        >
          <i data-lucide={role.icon} className="size-5" />
        </span>
        <span
          className="rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em]"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--ig-muted)' }}
        >
          {CAT_LABEL[role.cat]}
        </span>
      </div>
      <p className="text-sm font-semibold" style={{ color: 'oklch(0.965 0.006 75)' }}>
        {role.name}
      </p>
      <p className="text-xs" style={{ color: 'var(--ig-muted)' }}>
        {role.one}
      </p>
      <div
        className="text-xs leading-relaxed overflow-hidden"
        style={{
          maxHeight: open ? '320px' : '0px',
          opacity: open ? 1 : 0,
          transition: 'max-height .35s cubic-bezier(.22,1,.36,1), opacity .3s ease',
        }}
      >
        <p style={{ color: 'oklch(0.965 0.006 75 / 0.8)' }}>{role.do}</p>
        <p className="mt-2" style={{ color: 'var(--ig-muted)' }}>
          You build {role.build.toLowerCase()}
        </p>
        <p className="mt-1 italic" style={{ color: 'var(--ig-muted)' }}>
          You&apos;ll love it if {role.love.toLowerCase()}
        </p>
      </div>
    </button>
  )
}

function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, QuizAnswer>>({})
  const [result, setResult] = useState<QuizAnswer | null>(null)

  function reset() {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  if (result) {
    const meta = CAT_META[result]
    const roleIds = QUIZ_ROLE_MAP[result]
    const roles = ROLES.filter(r => roleIds.includes(r.id))
    return (
      <div className="quiz-step text-center">
        <span
          className="mx-auto flex size-16 items-center justify-center rounded-2xl animate-pulse-glow-ember"
          style={{
            background: `${meta.tint}1a`,
            color: meta.tint,
            boxShadow: `0 0 40px -8px ${meta.glow}`,
          }}
        >
          <i data-lucide={CAT_ICON[result]} className="size-8" />
        </span>
        <p className="mt-4 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--ig-muted)' }}>
          You&apos;d thrive here
        </p>
        <p className="mt-2 text-sm" style={{ color: 'var(--ig-muted)' }}>
          Three roles that fit how you think. Pick one when you register.
        </p>
        <div className="mt-5 grid gap-2 text-left">
          {roles.map((r, i) => (
            <div
              key={r.id}
              className="quiz-step flex items-center gap-2 rounded-lg p-2.5 transition-all hover:bg-white/[0.03]"
              style={{
                transitionDelay: `${i * 0.08}s`,
                borderColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <span
                className="flex size-7 items-center justify-center rounded-md"
                style={{ background: `${r.tint}1a`, color: r.tint }}
              >
                <i data-lucide={r.icon} className="size-4" />
              </span>
              <span className="text-xs font-medium" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
                {r.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: 'var(--ig-muted)' }}>
          Take it again if you&apos;re not sure — or just pick the one that sounds like you.
        </p>
        <div className="mt-5 text-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm hover:bg-white/[0.04]"
            style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, color: 'var(--ig-muted)' }}
          >
            Run it again
          </button>
        </div>
      </div>
    )
  }

  const cur = QUIZ[step]
  const progress = (step / QUIZ.length) * 100
  return (
    <div className="quiz-step">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Which role fits you?
        </h4>
        <span
          className="rounded-md px-2 py-0.5 text-[10px]"
          style={{ background: 'oklch(0.245 0.014 55)', color: 'var(--ig-muted)' }}
        >
          {step + 1}/{QUIZ.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--ember), var(--gold))',
          }}
        />
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
          {cur.q}
        </p>
        <div className="mt-3 grid gap-2">
          {cur.options.map((o, i) => (
            <button
              key={i}
              onClick={() => {
                const next = { ...answers, [step]: o[1] }
                setAnswers(next)
                if (step < QUIZ.length - 1) setStep(step + 1)
                else {
                  const counts: Record<QuizAnswer, number> = { coder: 0, artist: 0, director: 0 }
                  Object.values(next).forEach(c => (counts[c] += 1))
                  const winner = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as QuizAnswer
                  setResult(winner)
                }
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition-all hover:bg-white/[0.03]"
              style={{ borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, color: 'var(--ig-muted)' }}
            >
              <span
                className="flex size-4 shrink-0 items-center justify-center rounded-full"
                style={{ borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }}
              />
              <span className="flex-1" style={{ color: 'oklch(0.965 0.006 75 / 0.9)' }}>
                {o[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 inline-flex items-center gap-1 text-xs hover:text-white"
          style={{ color: 'var(--ig-muted)' }}
        >
          <i data-lucide="arrow-left" className="size-3" /> Back
        </button>
      )}
    </div>
  )
}
