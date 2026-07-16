import { useMemo, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { HouseSvg, MoneyInput } from '../components/atoms'
import { HouseFrame, type FloorSpec } from '../components/HouseFrame'
import { HOME_TYPES, TYPE_MULT, homeTypeLabel } from '../lib/locations'
import {
  fmt,
  fmtShort,
  keysDate,
  maxAffordablePrice,
  minDownPayment,
  mortgagePayment,
  savingsGoal,
} from '../lib/math'
import { CLOSING_RATE } from '../lib/config'
import { KEYRING, calcStreak, levelInfo } from '../lib/gamification'
import { LESSONS, STAGES } from '../data/curriculum'
import type { AppState, Plan } from '../types'

/** A cream "furniture" panel that sits inside a room. */
const roomCard = {
  background: C.paper,
  borderRadius: 14,
  padding: 16,
}

export function Dashboard({
  state,
  onLog,
  onUpdatePlan,
  onReset,
  onOpenLesson,
}: {
  state: AppState
  onLog: (amount: number) => void
  onUpdatePlan: (patch: Partial<Plan>, xpReward?: number) => void
  onReset: () => void
  onOpenLesson: (id: string) => void
}) {
  const { plan } = state
  const [logAmount, setLogAmount] = useState(plan.monthly)
  const [boost, setBoost] = useState(0)
  const lvl = levelInfo(state.xp)

  const dash = useMemo(() => {
    const contributed = state.contributions.reduce((a, c) => a + c.amount, 0)
    const totalSaved = plan.startingSavings + contributed
    const down = minDownPayment(plan.target, plan.homeType)
    const goal = savingsGoal(plan.target, plan.homeType)
    const remaining = Math.max(0, goal - totalSaved)
    const baseMonthly = plan.monthly * (plan.coBuyer ? 2 : 1)
    const effMonthly = baseMonthly + boost
    const months = effMonthly > 0 ? remaining / effMonthly : Infinity
    const baseMonths = baseMonthly > 0 ? remaining / baseMonthly : Infinity
    const progress = Math.min(1, totalSaved / goal)
    return {
      totalSaved,
      down,
      goal,
      remaining,
      months,
      baseMonths,
      progress,
      streak: calcStreak(state.contributions),
      payment: mortgagePayment(plan.target - down),
    }
  }, [state.contributions, plan, boost])

  // ————— Attic: the keys date hero —————
  const attic = (
    <>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 6,
        }}
      >
        Keys in hand · {plan.location}
      </div>
      <div style={{ fontFamily: DISPLAY_FONT, fontSize: 42, fontWeight: 800, lineHeight: 1.05 }}>
        {dash.remaining === 0 ? 'Today 🎉' : keysDate(dash.baseMonths)}
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
        {fmtShort(plan.target)} {homeTypeLabel(plan.homeType).toLowerCase()} · est.{' '}
        {fmt(dash.payment)}/mo mortgage{plan.coBuyer ? ' · 👥 with co-buyer' : ''}
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.max(3, dash.progress * 100)}%`,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.sprout}, ${C.gold})`,
              transition: 'width .6s ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 7, color: 'rgba(255,255,255,0.8)' }}>
          <span>
            {fmtShort(dash.totalSaved)} saved ({Math.round(dash.progress * 100)}%)
          </span>
          <span>Goal {fmtShort(dash.goal)} 🔑</span>
        </div>
      </div>
      {dash.streak > 0 && (
        <div
          style={{
            marginTop: 14,
            display: 'inline-block',
            background: 'rgba(255,255,255,0.14)',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          🔥 {dash.streak}-month saving streak
        </div>
      )}
    </>
  )

  // ————— Floors, top to bottom —————
  const floors: FloorSpec[] = []

  // Top floor: level + the house that builds itself.
  floors.push({
    key: 'level',
    label: 'Top floor · your level',
    node: (
      <div style={{ ...roomCard, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 110, flexShrink: 0 }}>
          <HouseSvg level={lvl.level} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.sub }}>
            Level {lvl.level}
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 19 }}>{lvl.title}</div>
          <div style={{ height: 8, borderRadius: 999, background: C.line, overflow: 'hidden', margin: '8px 0 4px' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.max(4, lvl.pct * 100)}%`,
                background: C.gold,
                borderRadius: 999,
                transition: 'width .5s ease',
              }}
            />
          </div>
          <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.4 }}>
            {lvl.max
              ? 'Max level — your house is fully built! 🎉'
              : `${lvl.toNext} XP to build the next piece.`}
          </div>
        </div>
      </div>
    ),
  })

  // Blueprint: faster paths (only when the date is 4+ years out).
  if (dash.baseMonths > 48) {
    floors.push({
      key: 'faster',
      label: 'Blueprint · faster paths',
      node: <FasterPaths state={state} totalSaved={dash.totalSaved} goal={dash.goal} onUpdatePlan={onUpdatePlan} />,
    })
  }

  // Main floor: log this month + the "what if" boost.
  floors.push({
    key: 'month',
    label: 'Main floor · this month',
    node: (
      <>
        <div style={{ ...roomCard, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Log this month’s savings</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <MoneyInput value={logAmount} onChange={setLogAmount} step={50} />
            </div>
            <button
              type="button"
              onClick={() => logAmount > 0 && onLog(logAmount)}
              style={{
                padding: '0 22px',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: DISPLAY_FONT,
                color: '#fff',
                background: C.sprout,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
        </div>
        <div style={roomCard}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>⚡ What if you saved more?</div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={boost}
            onChange={(e) => setBoost(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.gold }}
          />
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            {boost === 0 ? (
              <span style={{ color: C.sub }}>Drag to see your date move.</span>
            ) : (
              <>
                +{fmt(boost)}/mo → keys in <strong>{keysDate(dash.months)}</strong>{' '}
                <span style={{ color: C.sprout, fontWeight: 700 }}>
                  ({Math.max(0, Math.ceil(dash.baseMonths - dash.months))} months sooner)
                </span>
              </>
            )}
          </div>
        </div>
      </>
    ),
  })

  // Study: the next lesson nudge (only if there's an unlocked, unfinished one).
  const nextLesson = LESSONS.find(
    (l) =>
      !state.completedLessons.includes(l.id) &&
      dash.progress >= (STAGES.find((s) => s.id === l.stage)?.unlockAt ?? 0),
  )
  if (nextLesson) {
    floors.push({
      key: 'study',
      label: 'Study · next lesson',
      node: (
        <button
          type="button"
          onClick={() => onOpenLesson(nextLesson.id)}
          style={{ ...roomCard, width: '100%', textAlign: 'left', cursor: 'pointer', background: C.sproutSoft, fontFamily: BODY_FONT }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.spruce, marginBottom: 5 }}>
            Your next lesson · {nextLesson.mins} min
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>
            {nextLesson.emoji} {nextLesson.title} →
          </div>
        </button>
      ),
    })
  }

  // Ledger: recent deposits (only if there are any).
  if (state.contributions.length > 0) {
    floors.push({
      key: 'ledger',
      label: 'Ledger · recent deposits',
      node: (
        <div style={roomCard}>
          {state.contributions
            .slice(-4)
            .reverse()
            .map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13.5,
                  padding: '8px 2px',
                  borderBottom: i < Math.min(4, state.contributions.length) - 1 ? `1px solid ${C.line}` : 'none',
                }}
              >
                <span style={{ color: C.sub }}>
                  {new Date(c.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ fontWeight: 600, color: C.sprout }}>+{fmt(c.amount)}</span>
              </div>
            ))}
        </div>
      ),
    })
  }

  // ————— Foundation: the keyring —————
  const foundation = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {KEYRING.map((k) => {
        const earned = state.earnedBadges.includes(k.id)
        return (
          <div
            key={k.id}
            style={{
              textAlign: 'center',
              opacity: earned ? 1 : 0.4,
              background: earned ? C.goldSoft : 'rgba(255,255,255,0.08)',
              color: earned ? C.ink : '#fff',
              borderRadius: 12,
              padding: '10px 4px',
            }}
          >
            <div style={{ fontSize: 24 }}>{k.emoji}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 3, lineHeight: 1.3 }}>{k.label}</div>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <HouseFrame attic={attic} floors={floors} foundation={foundation} />

      <button
        type="button"
        onClick={onReset}
        style={{
          width: '100%',
          padding: '13px',
          fontSize: 14,
          fontWeight: 600,
          color: C.sub,
          background: 'transparent',
          border: `1.5px solid ${C.line}`,
          borderRadius: 14,
          cursor: 'pointer',
        }}
      >
        Start over with a new plan
      </button>
    </>
  )
}

/** "Faster paths" cards shown when the keys date is more than 4 years out.
 *  Never says "you can't afford it" — only offers ways to get there sooner. */
function FasterPaths({
  state,
  totalSaved,
  goal,
  onUpdatePlan,
}: {
  state: AppState
  totalSaved: number
  goal: number
  onUpdatePlan: (patch: Partial<Plan>, xpReward?: number) => void
}) {
  const { plan } = state
  const baseMonthly = plan.monthly * (plan.coBuyer ? 2 : 1) || 1
  const monthsFor = (g: number, rate = baseMonthly) => Math.max(0, g - totalSaved) / rate

  const paths: {
    id: string
    emoji: string
    label: string
    detail: string
    date: string
    apply: () => void
  }[] = []

  if (!plan.coBuyer) {
    paths.push({
      id: 'cobuy',
      emoji: '👥',
      label: 'Buy with a partner, sibling, or friend',
      detail: 'Two people saving together get there about twice as fast.',
      date: keysDate(monthsFor(goal, plan.monthly * 2 || 1)),
      apply: () => onUpdatePlan({ coBuyer: true }),
    })
  }

  const cheaper = HOME_TYPES.filter(
    (t) => TYPE_MULT[t.key] < TYPE_MULT[plan.homeType] && t.key !== 'land' && t.key !== 'mobile',
  )
  if (cheaper.length) {
    const t = cheaper[cheaper.length - 1]
    const target = Math.min(plan.base * TYPE_MULT[t.key], maxAffordablePrice(plan.income, t.key))
    paths.push({
      id: 'type',
      emoji: '🏢',
      label: `Start with a ${t.label.toLowerCase()} instead`,
      detail: 'Get in sooner, build equity, upgrade later.',
      date: keysDate(monthsFor(minDownPayment(target, t.key) + target * CLOSING_RATE)),
      apply: () => onUpdatePlan({ homeType: t.key, target }),
    })
  }

  const trimmed = Math.round(plan.target * 0.85)
  paths.push({
    id: 'trim',
    emoji: '🎯',
    label: 'Aim 15% below the average price',
    detail: 'Plenty of good homes sell under the average.',
    date: keysDate(monthsFor(minDownPayment(trimmed, plan.homeType) + trimmed * CLOSING_RATE)),
    apply: () => onUpdatePlan({ target: trimmed }),
  })

  return (
    <div style={{ background: C.goldSoft, border: `1.5px solid ${C.gold}`, borderRadius: 14, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 15, fontFamily: DISPLAY_FONT, marginBottom: 2 }}>
        🚀 Your date is a while away. Faster paths:
      </div>
      {paths.map((p) => (
        <div key={p.id} style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {p.emoji} {p.label}
          </div>
          <div style={{ fontSize: 12.5, color: C.sub, margin: '3px 0 8px', lineHeight: 1.45 }}>
            {p.detail} New date: <strong style={{ color: C.spruce }}>{p.date}</strong>
          </div>
          <button
            type="button"
            onClick={p.apply}
            style={{
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              background: C.sprout,
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: BODY_FONT,
            }}
          >
            Switch to this plan (+40 XP)
          </button>
        </div>
      ))}
    </div>
  )
}
