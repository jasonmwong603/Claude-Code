import { useMemo, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { HouseSvg, MoneyInput, Pills, inputStyle } from '../components/atoms'
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
import { projectKeys, maxQualifiedPrice, SCENARIOS } from '../lib/projection'
import { KEYRING, calcStreak, levelInfo } from '../lib/gamification'
import { bankSummary, refreshedAgo } from '../lib/plaid'
import { LESSONS, STAGES } from '../data/curriculum'
import type { AppState, Plan, TargetSource } from '../types'

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
  onEdit,
  onOpenBank,
  onRentBuy,
}: {
  state: AppState
  onLog: (amount: number) => void
  onUpdatePlan: (patch: Partial<Plan>, xpReward?: number) => void
  onReset: () => void
  onOpenLesson: (id: string) => void
  onEdit: () => void
  onOpenBank: () => void
  onRentBuy: () => void
}) {
  const bank = bankSummary()
  const { plan } = state
  // Has a deposit already been logged this calendar month? Drives the one-tap CTA.
  const loggedThisMonth = useMemo(() => {
    const now = new Date()
    return state.contributions.some((c) => {
      const d = new Date(c.date)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
  }, [state.contributions])
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
    // Appreciation-aware, range-based projection (replaces the old straight line).
    const proj = projectKeys(plan, totalSaved, effMonthly)
    const baseProj = projectKeys(plan, totalSaved, baseMonthly)
    const months = proj.likelyMonths
    const baseMonths = baseProj.likelyMonths
    const progress = Math.min(1, totalSaved / goal)
    return {
      totalSaved,
      down,
      goal,
      remaining,
      months,
      baseMonths,
      proj: baseProj,
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
        {dash.remaining === 0
          ? 'Today 🎉'
          : isFinite(dash.baseMonths)
            ? keysDate(dash.baseMonths)
            : 'Goalpost is moving'}
      </div>
      {dash.remaining > 0 && (
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
          {isFinite(dash.baseMonths)
            ? `likely window · ${keysDate(dash.proj.earliestMonths)} – ${keysDate(dash.proj.latestMonths)}`
            : 'at this rate prices may rise faster than you save — raise savings or aim lower'}
        </div>
      )}
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
        {fmtShort(plan.target)} {homeTypeLabel(plan.homeType).toLowerCase()} · est.{' '}
        {fmt(dash.payment)}/mo mortgage{plan.coBuyer ? ' · 👥 with co-buyer' : ''}
      </div>
      {!dash.proj.qualifiesNow && (
        <div
          style={{
            marginTop: 12,
            background: 'rgba(232,184,75,0.16)',
            border: '1px solid rgba(232,184,75,0.5)',
            borderRadius: 10,
            padding: '9px 11px',
            fontSize: 12,
            color: '#FBF3DD',
            lineHeight: 1.5,
          }}
        >
          ⚠️ <b>A date isn’t an approval.</b> At {fmt(plan.income)}/yr you likely wouldn’t{' '}
          <b>qualify</b> for {fmtShort(plan.target)} under the mortgage stress test. You’d need about{' '}
          {fmt(dash.proj.incomeToQualify)} household income — or aim closer to{' '}
          {fmtShort(maxQualifiedPrice(plan.income, plan.homeType))}.
          <div style={{ marginTop: 6, fontWeight: 700 }}>
            👇 Scroll to <i>Your options</i> — we’ve mapped the routes that do work.
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onRentBuy}
        style={{
          marginTop: 12,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 999,
          color: '#fff',
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: BODY_FONT,
          padding: '8px 14px',
          cursor: 'pointer',
        }}
      >
        🤔 Should you even buy? See rent vs. buy →
      </button>
      {plan.targetSource === 'custom' && plan.targetLabel && (
        <div style={{ marginTop: 10 }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.14)',
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            🏡 {plan.targetLabel}
            {plan.listingUrl && (
              <>
                {' · '}
                <a
                  href={plan.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: C.gold, textDecoration: 'underline' }}
                >
                  view listing
                </a>
              </>
            )}
          </span>
        </div>
      )}
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

  // Top floor: level + the house that builds itself. (Hidden in focus mode.)
  if (!state.focusMode) floors.push({
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

  // Plans: what you're aiming at (area price, or a listing/budget you chose).
  floors.push({
    key: 'target',
    label: 'Plans · your target',
    node: <TargetRoom plan={plan} onUpdatePlan={onUpdatePlan} />,
  })

  // Vault: live bank balances (Plaid-shaped preview).
  floors.push({
    key: 'bank',
    label: 'Vault · your money',
    node: bank.linked ? (
      <button
        type="button"
        onClick={onOpenBank}
        style={{ ...roomCard, width: '100%', textAlign: 'left', cursor: 'pointer', border: `1.5px solid ${C.line}` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>In your accounts</div>
            <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 22 }}>{fmt(bank.fundTotal)}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
              {bank.accounts} account{bank.accounts === 1 ? '' : 's'} · updated {refreshedAgo(bank.lastRefreshed)}
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.spruce }}>Manage →</span>
        </div>
      </button>
    ) : (
      <button
        type="button"
        onClick={onOpenBank}
        style={{
          ...roomCard,
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          background: C.sproutSoft,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>🔗 Connect a bank (view only)</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, lineHeight: 1.45 }}>
          Watch your real balance climb toward your keys date. KeyDate can never move your money.
        </div>
      </button>
    ),
  })

  // Blueprint: alternate paths — shown when the date is far out, the goalpost is
  // outrunning them, or they wouldn't qualify. Never a dead end: every "no" here
  // comes with a route that works.
  const needsPlanB = !isFinite(dash.baseMonths) || dash.baseMonths > 48 || !dash.proj.qualifiesNow
  if (needsPlanB) {
    floors.push({
      key: 'faster',
      label: 'Blueprint · your options',
      node: (
        <FasterPaths
          state={state}
          totalSaved={dash.totalSaved}

          months={dash.baseMonths}
          qualifies={dash.proj.qualifiesNow}
          onUpdatePlan={onUpdatePlan}
          onRentBuy={onRentBuy}
        />
      ),
    })
  }

  // Main floor: log this month + the "what if" boost.
  floors.push({
    key: 'month',
    label: 'Main floor · this month',
    node: (
      <>
        <div style={{ ...roomCard, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Log this month’s savings</div>
          {loggedThisMonth ? (
            <div style={{ fontSize: 12.5, color: C.sprout, fontWeight: 600, marginBottom: 10 }}>
              ✓ Logged this month — nice work. Add more any time.
            </div>
          ) : (
            <button
              type="button"
              onClick={() => plan.monthly > 0 && onLog(plan.monthly)}
              style={{
                width: '100%',
                padding: '11px',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: DISPLAY_FONT,
                color: C.spruce,
                background: C.sproutSoft,
                border: `1.5px dashed ${C.sprout}`,
                borderRadius: 12,
                cursor: 'pointer',
                margin: '6px 0 10px',
              }}
            >
              ⚡ Same as usual — log {fmt(plan.monthly)}
            </button>
          )}
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
              <span style={{ color: C.sub }}>💡 {dash.proj.topLever}</span>
            ) : !isFinite(dash.months) ? (
              <span style={{ color: C.sub }}>
                Even +{fmt(boost)}/mo doesn’t outrun the rising price on this path — a bigger boost or a lower target is needed.
              </span>
            ) : (
              <>
                +{fmt(boost)}/mo → keys in <strong>{keysDate(dash.months)}</strong>{' '}
                {isFinite(dash.baseMonths) && (
                  <span style={{ color: C.sprout, fontWeight: 700 }}>
                    ({Math.max(0, Math.ceil(dash.baseMonths - dash.months))} months sooner)
                  </span>
                )}
              </>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 8, lineHeight: 1.5 }}>
            Dates assume ~3%/yr price growth &amp; ~3% return on savings (the “Likely” scenario), a{' '}
            {(SCENARIOS.likely.appreciation * 100).toFixed(0)}% market and the federal stress test. Estimates, not a guarantee — your real date will move.
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
      <div style={{ gridColumn: '1 / -1', fontSize: 10.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, marginTop: 2 }}>
        💡 Savings keys ($ milestones &amp; fully-funded) verify against your connected bank balance —
        so they can't be faked by changing your goal.
      </div>
    </div>
  )

  return (
    <>
      <HouseFrame attic={attic} floors={floors} foundation={state.focusMode ? undefined : foundation} />

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={onEdit}
          style={{
            flex: 2,
            padding: '13px',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: DISPLAY_FONT,
            color: '#fff',
            background: C.spruce,
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
          }}
        >
          ✏️ Edit my plan
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{
            flex: 1,
            padding: '13px',
            fontSize: 13,
            fontWeight: 600,
            color: C.sub,
            background: 'transparent',
            border: `1.5px solid ${C.line}`,
            borderRadius: 14,
            cursor: 'pointer',
          }}
        >
          Start over
        </button>
      </div>

      {/* Support / feedback — beta users need somewhere to go. */}
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
        Something wrong, or a number look off?{' '}
        <a
          href="mailto:hello@keydate.ca?subject=KeyDate%20feedback"
          style={{ color: C.spruce, fontWeight: 600 }}
        >
          Tell us — we read everything
        </a>
        <br />
        <a href="/privacy/" style={{ color: C.sub, textDecoration: 'underline' }}>
          Privacy
        </a>{' '}
        ·{' '}
        <a href="/terms/" style={{ color: C.sub, textDecoration: 'underline' }}>
          Terms
        </a>
      </div>
    </>
  )
}

/** Alternate paths — shown when the date is far out, the price is outrunning the
 *  saver, or they wouldn't qualify. The rule: never leave the user at a dead end.
 *  Every discouraging finding here is paired with a route that actually works,
 *  including the legitimate option of renting longer and investing. */
function FasterPaths({
  state,
  totalSaved,
  months,
  qualifies,
  onUpdatePlan,
  onRentBuy,
}: {
  state: AppState
  totalSaved: number
  months: number
  qualifies: boolean
  onUpdatePlan: (patch: Partial<Plan>, xpReward?: number) => void
  onRentBuy: () => void
}) {
  const { plan } = state
  const baseMonthly = plan.monthly * (plan.coBuyer ? 2 : 1) || 1
  // Use the same appreciation-aware model as the hero so these dates are honest.
  const dateFor = (patch: Partial<Plan>, monthly = baseMonthly) => {
    const m = projectKeys({ ...plan, ...patch } as Plan, totalSaved, monthly).likelyMonths
    return isFinite(m) ? keysDate(m) : 'still out of reach'
  }

  const paths: {
    id: string
    emoji: string
    label: string
    detail: string
    date: string
    apply: () => void
  }[] = []

  // 1. If they can't qualify, lead with a target they actually can.
  const maxQ = maxQualifiedPrice(plan.income, plan.homeType)
  if (!qualifies && maxQ > 0) {
    const qTarget = Math.round(maxQ / 1000) * 1000
    paths.push({
      id: 'qualify',
      emoji: '✅',
      label: `Aim at ${fmtShort(qTarget)} — what you could actually be approved for`,
      detail: 'Re-aims your plan at a price a lender would likely approve at your income.',
      date: dateFor({ target: qTarget }),
      apply: () => onUpdatePlan({ target: qTarget, targetSource: 'custom', targetLabel: 'What I can qualify for' }),
    })
  }

  if (!plan.coBuyer) {
    paths.push({
      id: 'cobuy',
      emoji: '👥',
      label: 'Buy with a partner, sibling, or friend',
      detail: 'Two incomes save faster and qualify for more.',
      date: dateFor({ coBuyer: true }, plan.monthly * 2 || 1),
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
      label: `Start with ${/^[aeiou]/i.test(t.label) ? 'an' : 'a'} ${t.label.toLowerCase()} instead`,
      detail: 'Get in sooner, build equity, upgrade later.',
      date: dateFor({ homeType: t.key, target }),
      apply: () => onUpdatePlan({ homeType: t.key, target }),
    })
  }

  const trimmed = Math.round(plan.target * 0.85)
  paths.push({
    id: 'trim',
    emoji: '🎯',
    label: 'Aim 15% below the average price',
    detail: 'Plenty of good homes sell under the average.',
    date: dateFor({ target: trimmed }),
    apply: () => onUpdatePlan({ target: trimmed }),
  })

  const heading = !qualifies
    ? '🧭 Here’s how to get to a “yes”'
    : !isFinite(months)
      ? '🧭 Prices are outrunning this plan — here’s what works'
      : '🚀 Your date is a while away. Faster paths:'

  return (
    <div style={{ background: C.goldSoft, border: `1.5px solid ${C.gold}`, borderRadius: 14, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 15, fontFamily: DISPLAY_FONT, marginBottom: 2 }}>
        {heading}
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

      {/* Renting longer is a legitimate outcome, not a failure. */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', marginTop: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>📈 Or: rent a while longer and invest</div>
        <div style={{ fontSize: 12.5, color: C.sub, margin: '3px 0 8px', lineHeight: 1.45 }}>
          Waiting isn’t losing. For plenty of people right now, renting and investing the difference
          builds more wealth — and keeps you flexible until the numbers work.
        </div>
        <button
          type="button"
          onClick={onRentBuy}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            color: C.spruce,
            background: '#fff',
            border: `1.5px solid ${C.line}`,
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: BODY_FONT,
          }}
        >
          Compare rent vs. buy →
        </button>
      </div>
    </div>
  )
}

const TARGET_MODES: { key: TargetSource; label: string }[] = [
  { key: 'area', label: 'Area typical' },
  { key: 'custom', label: 'Listing / budget' },
]

/** Shows the current target and lets the user re-aim it at a specific listing
 *  price or a budget they're envisioning (or back to the area's typical price). */
function TargetRoom({
  plan,
  onUpdatePlan,
}: {
  plan: Plan
  onUpdatePlan: (patch: Partial<Plan>, xpReward?: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [mode, setMode] = useState<TargetSource>(plan.targetSource ?? 'area')
  const [price, setPrice] = useState(plan.targetSource === 'custom' ? plan.target : 0)
  const [label, setLabel] = useState(plan.targetLabel ?? '')
  const [url, setUrl] = useState(plan.listingUrl ?? '')

  const start = () => {
    setMode(plan.targetSource ?? 'area')
    setPrice(plan.targetSource === 'custom' ? plan.target : 0)
    setLabel(plan.targetLabel ?? '')
    setUrl(plan.listingUrl ?? '')
    setEditing(true)
  }

  const save = () => {
    if (mode === 'area') {
      const target = Math.min(
        plan.base * TYPE_MULT[plan.homeType],
        maxAffordablePrice(plan.income, plan.homeType),
      )
      onUpdatePlan({ target, targetSource: 'area', targetLabel: undefined, listingUrl: undefined }, 0)
      setEditing(false)
    } else if (price > 0) {
      onUpdatePlan(
        {
          target: Math.max(1, price),
          targetSource: 'custom',
          targetLabel: label.trim() || 'My target',
          listingUrl: url.trim() || undefined,
        },
        0,
      )
      setEditing(false)
    }
  }

  const isCustom = plan.targetSource === 'custom'

  if (!editing) {
    return (
      <div style={{ ...roomCard, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>Aiming at</div>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 22 }}>{fmt(plan.target)}</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2, lineHeight: 1.4 }}>
            {isCustom
              ? `🏡 ${plan.targetLabel || 'Your target'}`
              : `Typical ${homeTypeLabel(plan.homeType).toLowerCase()} in ${plan.location}`}
          </div>
        </div>
        <button
          type="button"
          onClick={start}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            color: C.spruce,
            background: '#fff',
            border: `1.5px solid ${C.line}`,
            borderRadius: 10,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Edit
        </button>
      </div>
    )
  }

  return (
    <div style={roomCard}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Set your target</div>
      <Pills options={TARGET_MODES} value={mode} onChange={setMode} />
      {mode === 'custom' && (
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>Target price</div>
            <MoneyInput value={price} onChange={setPrice} step={5000} />
          </div>
          <input
            type="text"
            placeholder="Name it — e.g. 123 Elm St, or “My budget”"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={inputStyle}
          />
          <input
            type="url"
            inputMode="url"
            placeholder="Listing link (optional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}
      {mode === 'area' && (
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 10, lineHeight: 1.45 }}>
          Uses a typical {homeTypeLabel(plan.homeType).toLowerCase()} price for {plan.location}.
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => setEditing(false)}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: 14,
            fontWeight: 600,
            color: C.sub,
            background: '#fff',
            border: `1.5px solid ${C.line}`,
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={mode === 'custom' && price <= 0}
          style={{
            flex: 2,
            padding: '12px',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: DISPLAY_FONT,
            color: '#fff',
            background: mode === 'custom' && price <= 0 ? '#A9B8B0' : C.sprout,
            border: 'none',
            borderRadius: 12,
            cursor: mode === 'custom' && price <= 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Update target
        </button>
      </div>
    </div>
  )
}
