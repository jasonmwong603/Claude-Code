import { useEffect, useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from './theme'
import { Welcome } from './screens/Welcome'
import { Onboarding, type OnboardingResult } from './screens/Onboarding'
import { Dashboard } from './screens/Dashboard'
import { Learn } from './screens/Learn'
import { Forum } from './screens/Forum'
import { EditPlan } from './screens/EditPlan'
import { Bank } from './screens/Bank'
import { Profile } from './screens/Profile'
import { PixelAvatar } from './components/PixelAvatar'
import { DEFAULT_PROFILE } from './data/cosmetics'
import type { PlanFormValues } from './components/PlanForm'
import type { Profile as ProfileT } from './types'
import { TYPE_MULT } from './lib/locations'
import { maxAffordablePrice, savingsGoal } from './lib/math'
import { clearState, loadState, saveState } from './lib/storage'
import { authConfigured, getCurrentUser, onAuthChange, signIn, signOut, type AuthUser, type OAuthProvider } from './lib/auth'
import { KEYRING, badgeTests, calcStreak, levelInfo } from './lib/gamification'
import { bankSummary } from './lib/plaid'
import type { AppState, Badge, Plan } from './types'

type Screen = 'loading' | 'welcome' | 'onboard' | 'dashboard' | 'learn' | 'forum' | 'editplan' | 'bank' | 'profile'

const ENTERED_KEY = 'keydate-entered'

/** Derive a target price from the plan inputs (area typical, or exact custom). */
function targetFrom(
  source: PlanFormValues['targetSource'],
  base: number,
  homeType: PlanFormValues['homeType'],
  income: number,
  customPrice: number,
): number {
  return source === 'custom'
    ? Math.max(1, customPrice)
    : Math.min(base * TYPE_MULT[homeType], maxAffordablePrice(income, homeType))
}

/** Award any newly-earned badges. Money/goal badges are cross-referenced
 *  against the connected bank balance (via bankSummary) so they can't be gamed
 *  by editing the plan or lowering the goal. */
function awardBadges(s: AppState): { earnedBadges: string[]; newly: Badge[] } {
  const savedSelf = s.plan.startingSavings + s.contributions.reduce((a, c) => a + c.amount, 0)
  const bank = bankSummary()
  const tests = badgeTests({
    contributions: s.contributions,
    streak: calcStreak(s.contributions),
    completedLessons: s.completedLessons,
    savedSelf,
    goal: savingsGoal(s.plan.target, s.plan.homeType),
    bankLinked: bank.linked,
    bankSaved: bank.fundTotal,
  })
  const newly = KEYRING.filter((k) => !s.earnedBadges.includes(k.id) && tests[k.id])
  return { earnedBadges: [...s.earnedBadges, ...newly.map((k) => k.id)], newly }
}

export default function KeyDateApp() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [state, setState] = useState<AppState | null>(null)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState<Badge | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)

  // Load persisted state once, and award the daily check-in XP.
  useEffect(() => {
    let s = loadState()
    if (s) {
      const today = new Date().toDateString()
      if (s.lastVisit !== today) {
        s = { ...s, lastVisit: today, xp: s.xp + 10 }
      }
      // Re-check badges on load (e.g. a bank was linked in a prior session, so
      // bank-verified money achievements can now be granted).
      const { earnedBadges, newly } = awardBadges(s)
      if (newly.length) s = { ...s, earnedBadges, xp: s.xp + newly.length * 50 }
      saveState(s)
      setState(s)
      setScreen('dashboard')
      return
    }
    // No saved plan yet — new user. Show the welcome/login front door first,
    // unless they've already entered (chose guest, or are signed in).
    if (localStorage.getItem(ENTERED_KEY)) {
      setScreen('onboard')
      return
    }
    if (!authConfigured) {
      setScreen('welcome')
      return
    }
    getCurrentUser().then((u) => {
      if (u) {
        localStorage.setItem(ENTERED_KEY, '1')
        setScreen('onboard')
      } else {
        setScreen('welcome')
      }
    })
  }, [])

  const enterAsGuest = () => {
    localStorage.setItem(ENTERED_KEY, '1')
    setScreen('onboard')
  }

  // Track the signed-in user (Google / Facebook). No-op in guest / unconfigured
  // mode. On first sign-in, seed an empty display name from the social profile.
  useEffect(() => {
    if (!authConfigured) return
    getCurrentUser().then(setUser)
    return onAuthChange((u) => {
      setUser(u)
      if (u?.name) {
        setState((prev) => {
          if (!prev?.profile || prev.profile.displayName.trim()) return prev
          const next = { ...prev, profile: { ...prev.profile, displayName: u.name as string } }
          saveState(next)
          return next
        })
      }
    })
  }, [])

  const handleSignIn = (provider: OAuthProvider) => {
    signIn(provider).catch((e) => alert(`Couldn't start sign-in: ${e?.message ?? e}`))
  }
  const handleSignOut = () => {
    signOut().finally(() => setUser(null))
  }

  const persist = (s: AppState) => {
    setState(s)
    saveState(s)
  }

  const celebrateNewly = (newly: Badge[]) => {
    if (newly.length) {
      setCelebrate(newly[newly.length - 1])
      setTimeout(() => setCelebrate(null), 3500)
    }
  }

  const createPlan = ({
    resolved,
    homeType,
    income,
    savings,
    monthly,
    targetSource,
    customPrice,
    targetLabel,
    listingUrl,
  }: OnboardingResult) => {
    // A custom target (a listing or a chosen budget) is honoured exactly — we
    // never quietly cap it to "affordable"; the faster-paths nudges surface on
    // their own if the date lands far out.
    const target = targetFrom(targetSource, resolved.base, homeType, income, customPrice)
    const s: AppState = {
      plan: {
        location: resolved.name,
        base: resolved.base,
        homeType,
        income,
        startingSavings: savings,
        monthly,
        target,
        createdAt: new Date().toISOString(),
        targetSource,
        targetLabel: targetSource === 'custom' ? targetLabel.trim() || 'My target' : undefined,
        listingUrl: targetSource === 'custom' ? listingUrl.trim() || undefined : undefined,
      },
      contributions: [],
      earnedBadges: ['plan'],
      completedLessons: [],
      xp: 25,
      lastVisit: new Date().toDateString(),
      profile: { ...DEFAULT_PROFILE },
    }
    persist(s)
    setScreen('dashboard')
  }

  const saveProfile = (profile: ProfileT) => {
    if (!state) return
    persist({ ...state, profile })
  }

  const logContribution = (amount: number) => {
    if (!state || amount <= 0) return
    const contributions = [...state.contributions, { date: new Date().toISOString(), amount }]
    const interim: AppState = { ...state, contributions }
    const { earnedBadges, newly } = awardBadges(interim)
    persist({ ...interim, earnedBadges, xp: state.xp + 50 + newly.length * 50 })
    celebrateNewly(newly)
  }

  const completeLesson = (lessonId: string, bonus = 0) => {
    if (!state) return
    const alreadyDone = state.completedLessons.includes(lessonId)
    const completedLessons = alreadyDone
      ? state.completedLessons
      : [...state.completedLessons, lessonId]
    const interim: AppState = { ...state, completedLessons }
    const { earnedBadges, newly } = awardBadges(interim)
    const lessonXp = alreadyDone ? 0 : 100 + bonus
    persist({ ...interim, earnedBadges, xp: state.xp + lessonXp + newly.length * 50 })
    setActiveLesson(null)
    celebrateNewly(newly)
  }

  const updatePlan = (patch: Partial<Plan>, xpReward = 40) => {
    if (!state) return
    const interim: AppState = { ...state, plan: { ...state.plan, ...patch } }
    const { earnedBadges, newly } = awardBadges(interim)
    persist({ ...interim, earnedBadges, xp: state.xp + xpReward + newly.length * 50 })
    celebrateNewly(newly)
  }

  // Re-evaluate badges after a bank change (connect / refresh / mark accounts).
  const recheckBadges = () => {
    if (!state) return
    const { earnedBadges, newly } = awardBadges(state)
    if (newly.length) {
      persist({ ...state, earnedBadges, xp: state.xp + newly.length * 50 })
      celebrateNewly(newly)
    }
  }

  const resetPlan = () => {
    clearState()
    setState(null)
    setActiveLesson(null)
    setScreen('onboard')
  }

  const savePlanEdits = ({
    resolved,
    homeType,
    income,
    savings,
    monthly,
    targetSource,
    customPrice,
    targetLabel,
    listingUrl,
  }: PlanFormValues) => {
    if (!state) return
    // Patch only the plan inputs; contributions, XP, badges, and lessons are
    // preserved because we spread the existing plan and never touch the rest.
    const plan: Plan = {
      ...state.plan,
      location: resolved.name,
      base: resolved.base,
      homeType,
      income,
      startingSavings: savings,
      monthly,
      target: targetFrom(targetSource, resolved.base, homeType, income, customPrice),
      targetSource,
      targetLabel: targetSource === 'custom' ? targetLabel.trim() || 'My target' : undefined,
      listingUrl: targetSource === 'custom' ? listingUrl.trim() || undefined : undefined,
    }
    const interim: AppState = { ...state, plan }
    const { earnedBadges, newly } = awardBadges(interim)
    persist({ ...interim, earnedBadges, xp: state.xp + newly.length * 50 })
    celebrateNewly(newly)
    setScreen('dashboard')
  }

  const openLesson = (id: string) => {
    setActiveLesson(id)
    setScreen('learn')
  }

  const earnXp = (n: number) => {
    if (!state) return
    persist({ ...state, xp: state.xp + n })
  }

  const lvl = state ? levelInfo(state.xp) : null

  if (screen === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: C.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: BODY_FONT,
          color: C.sub,
        }}
      >
        Loading your plan…
      </div>
    )
  }

  const NavBar = () => (
    <div
      style={{
        display: 'flex',
        gap: 8,
        margin: '0 0 4px',
        background: '#fff',
        border: `1.5px solid ${C.line}`,
        borderRadius: 999,
        padding: 4,
      }}
    >
      {[
        { id: 'dashboard', label: '🏠 Home' },
        { id: 'learn', label: '📚 Learn' },
        { id: 'forum', label: '🏘️ Community' },
      ].map((t) => {
        const active = screen === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setScreen(t.id as Screen)
              setActiveLesson(null)
            }}
            style={{
              flex: 1,
              padding: '10px 4px',
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: BODY_FONT,
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: active ? C.spruce : 'transparent',
              color: active ? '#fff' : C.sub,
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )

  if (screen === 'welcome') {
    return <Welcome authConfigured={authConfigured} onSignIn={handleSignIn} onGuest={enterAsGuest} />
  }

  return (
    <div style={{ minHeight: '100vh', background: C.paper, fontFamily: BODY_FONT, color: C.ink }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Key<span style={{ color: C.sprout }}>Date</span>
          </div>
          {state && state.profile && lvl && (
            <button
              type="button"
              onClick={() => setScreen('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: `1.5px solid ${C.line}`,
                borderRadius: 999,
                padding: '4px 10px 4px 4px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: C.sproutSoft,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <PixelAvatar config={state.profile.avatar} mode="head" size={30} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.spruce }}>Lv {lvl.level} · {state.xp} XP</span>
            </button>
          )}
        </div>

        {state &&
          screen !== 'onboard' &&
          screen !== 'editplan' &&
          screen !== 'bank' &&
          screen !== 'profile' && <NavBar />}

        {celebrate && (
          <div
            style={{
              background: C.goldSoft,
              border: `2px solid ${C.gold}`,
              borderRadius: 16,
              padding: '14px 18px',
              margin: '14px 0',
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {celebrate.emoji} New key earned: {celebrate.label}!
          </div>
        )}

        {screen === 'onboard' && <Onboarding onSubmit={createPlan} />}

        {screen === 'dashboard' && state && (
          <Dashboard
            state={state}
            onLog={logContribution}
            onUpdatePlan={updatePlan}
            onReset={resetPlan}
            onOpenLesson={openLesson}
            onEdit={() => setScreen('editplan')}
            onOpenBank={() => setScreen('bank')}
          />
        )}

        {screen === 'editplan' && state && (
          <EditPlan plan={state.plan} onSave={savePlanEdits} onCancel={() => setScreen('dashboard')} />
        )}

        {screen === 'bank' && state && (
          <Bank
            onBack={() => setScreen('dashboard')}
            onSetSavings={(total) => updatePlan({ startingSavings: total }, 0)}
            onBankChange={recheckBadges}
          />
        )}

        {screen === 'profile' && state && state.profile && (
          <Profile
            state={state}
            onSave={saveProfile}
            onBack={() => setScreen('dashboard')}
            authConfigured={authConfigured}
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}

        {screen === 'learn' && state && (
          <Learn
            state={state}
            activeLesson={activeLesson}
            onOpenLesson={setActiveLesson}
            onCloseLesson={() => setActiveLesson(null)}
            onComplete={completeLesson}
          />
        )}

        {screen === 'forum' && state && <Forum state={state} onEarnXp={earnXp} />}
      </div>
    </div>
  )
}
