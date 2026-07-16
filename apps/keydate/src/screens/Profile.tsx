import { useState, type ReactNode } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { Avatar } from '../components/Avatar'
import { inputStyle } from '../components/atoms'
import {
  ACCESSORIES,
  AVATARS,
  BANNERS,
  FRAMES,
  TITLES,
  avatarOf,
  bannerOf,
  titleOf,
  unlockCounts,
} from '../data/cosmetics'
import { calcStreak, levelInfo } from '../lib/gamification'
import { keysDate, savingsGoal } from '../lib/math'
import type { AppState, Profile as ProfileT } from '../types'

export function Profile({
  state,
  onSave,
  onBack,
}: {
  state: AppState
  onSave: (p: ProfileT) => void
  onBack: () => void
}) {
  const profile = state.profile!
  const lvl = levelInfo(state.xp)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ProfileT>(profile)

  const shown = editing ? draft : profile
  const banner = bannerOf(shown.banner)
  const name = shown.displayName.trim() || 'Future Homeowner'
  const title = titleOf(shown.title).label

  // Stats
  const goal = savingsGoal(state.plan.target, state.plan.homeType)
  const totalSaved = state.plan.startingSavings + state.contributions.reduce((a, c) => a + c.amount, 0)
  const progress = Math.min(1, totalSaved / goal)
  const baseMonthly = state.plan.monthly * (state.plan.coBuyer ? 2 : 1)
  const remaining = Math.max(0, goal - totalSaved)
  const date = remaining === 0 ? 'Today 🎉' : keysDate(baseMonthly > 0 ? remaining / baseMonthly : Infinity)
  const wardrobe = unlockCounts(lvl.level)

  const callingCard = (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${C.line}` }}>
      <div
        style={{
          background: banner.background,
          height: 96,
          position: 'relative',
        }}
      />
      <div style={{ background: '#fff', padding: '0 18px 18px', textAlign: 'center', marginTop: -44 }}>
        <div style={{ display: 'inline-block' }}>
          <Avatar avatar={shown.avatar} accessory={shown.accessory} frame={shown.frame} size={88} />
        </div>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 22, marginTop: 8 }}>{name}</div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 4,
            fontSize: 12.5,
            fontWeight: 700,
            color: C.spruce,
            background: C.sproutSoft,
            borderRadius: 999,
            padding: '3px 12px',
          }}
        >
          {title} · Lv {lvl.level}
        </div>
        {shown.bio.trim() && (
          <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, marginTop: 10 }}>{shown.bio.trim()}</div>
        )}
      </div>
    </div>
  )

  if (editing) {
    return (
      <>
        <TopBar label="Edit profile" onBack={() => setEditing(false)} />
        {callingCard}

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Display name</FieldLabel>
          <input
            type="text"
            placeholder="What should we call you?"
            value={draft.displayName}
            onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
            style={{ ...inputStyle, marginBottom: 14 }}
            maxLength={30}
          />
          <FieldLabel>Bio</FieldLabel>
          <textarea
            placeholder="A line about your home dream…"
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            rows={2}
            maxLength={140}
            style={{ ...inputStyle, resize: 'vertical', marginBottom: 6 }}
          />
        </div>

        <div style={{ fontSize: 12, color: C.sub, margin: '8px 0 16px' }}>
          🎁 {wardrobe.unlocked}/{wardrobe.total} items unlocked · keep earning XP to unlock more.
        </div>

        <Wardrobe
          title="Avatar"
          level={lvl.level}
          items={AVATARS}
          selected={draft.avatar}
          onPick={(id) => setDraft({ ...draft, avatar: id })}
          render={(it) => <span style={{ fontSize: 30 }}>{avatarOf(it.id).emoji}</span>}
        />
        <Wardrobe
          title="Headwear & accessories"
          level={lvl.level}
          items={ACCESSORIES}
          selected={draft.accessory}
          onPick={(id) => setDraft({ ...draft, accessory: id })}
          render={(it) =>
            it.id === 'none' ? (
              <span style={{ fontSize: 12, color: C.sub }}>None</span>
            ) : (
              <span style={{ fontSize: 28 }}>{ACCESSORIES.find((a) => a.id === it.id)?.emoji}</span>
            )
          }
        />
        <Wardrobe
          title="Avatar frame"
          level={lvl.level}
          items={FRAMES}
          selected={draft.frame}
          onPick={(id) => setDraft({ ...draft, frame: id })}
          render={(it) => <Avatar avatar={draft.avatar} accessory="none" frame={it.id} size={42} />}
        />
        <Wardrobe
          title="Calling-card banner"
          level={lvl.level}
          items={BANNERS}
          selected={draft.banner}
          onPick={(id) => setDraft({ ...draft, banner: id })}
          render={(it) => (
            <div
              style={{
                width: '100%',
                height: 34,
                borderRadius: 8,
                background: bannerOf(it.id).background,
              }}
            />
          )}
        />
        <Wardrobe
          title="Title"
          level={lvl.level}
          items={TITLES}
          selected={draft.title}
          onPick={(id) => setDraft({ ...draft, title: id })}
          render={(it) => (
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, textAlign: 'center' }}>
              {titleOf(it.id).label}
            </span>
          )}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button
            type="button"
            onClick={() => {
              setDraft(profile)
              setEditing(false)
            }}
            style={{
              flex: 1,
              padding: '15px',
              fontSize: 15,
              fontWeight: 600,
              color: C.sub,
              background: '#fff',
              border: `1.5px solid ${C.line}`,
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft)
              setEditing(false)
            }}
            style={{
              flex: 2,
              padding: '15px',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: DISPLAY_FONT,
              color: '#fff',
              background: C.spruce,
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            Save profile
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar label="Your profile" onBack={onBack} />
      {callingCard}

      {/* XP progress toward next level */}
      <div style={{ margin: '14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.sub, marginBottom: 6 }}>
          <span>
            Lv {lvl.level} {lvl.title} · {state.xp} XP
          </span>
          <span>{lvl.max ? 'Max level 🎉' : `${lvl.toNext} XP to Lv ${lvl.level + 1}`}</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: C.line, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.max(4, lvl.pct * 100)}%`,
              background: `linear-gradient(90deg, ${C.sprout}, ${C.gold})`,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Stat label="Keys date" value={date} />
        <Stat label="Saved" value={`${Math.round(progress * 100)}%`} />
        <Stat label="Deposit streak" value={`${calcStreak(state.contributions)} mo`} />
        <Stat label="Keys earned" value={`${state.earnedBadges.length}/12`} />
      </div>

      <div style={{ fontSize: 12, color: C.sub, marginBottom: 16, textAlign: 'center' }}>
        🎁 {wardrobe.unlocked}/{wardrobe.total} cosmetics unlocked
      </div>

      <button
        type="button"
        onClick={() => {
          setDraft(profile)
          setEditing(true)
        }}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: 15,
          fontWeight: 700,
          fontFamily: DISPLAY_FONT,
          color: '#fff',
          background: C.spruce,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
        }}
      >
        ✏️ Edit profile & wardrobe
      </button>
    </>
  )
}

function TopBar({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0 12px' }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: C.sub,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '8px 0',
          fontFamily: BODY_FONT,
        }}
      >
        ← Back
      </button>
      <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 18 }}>{label}</span>
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{children}</div>
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.paper, borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 11.5, color: C.sub, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 17, marginTop: 2 }}>{value}</div>
    </div>
  )
}

interface CosmeticLike {
  id: string
  label: string
  unlockLevel: number
}

function Wardrobe({
  title,
  level,
  items,
  selected,
  onPick,
  render,
}: {
  title: string
  level: number
  items: CosmeticLike[]
  selected: string
  onPick: (id: string) => void
  render: (item: CosmeticLike) => ReactNode
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {items.map((it) => {
          const locked = level < it.unlockLevel
          const active = selected === it.id
          return (
            <button
              key={it.id}
              type="button"
              disabled={locked}
              onClick={() => !locked && onPick(it.id)}
              title={locked ? `Unlocks at Lv ${it.unlockLevel}` : it.label}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: 4,
                borderRadius: 12,
                cursor: locked ? 'not-allowed' : 'pointer',
                background: active ? C.sproutSoft : '#fff',
                border: `1.5px solid ${active ? C.sprout : C.line}`,
                opacity: locked ? 0.55 : 1,
                overflow: 'hidden',
              }}
            >
              {render(it)}
              {locked && (
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(247,248,244,0.72)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.sub,
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 15 }}>🔒</span>
                  Lv {it.unlockLevel}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
