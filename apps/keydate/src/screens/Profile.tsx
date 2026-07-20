import { useState, type ReactNode } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { PixelAvatar } from '../components/PixelAvatar'
import { AccountPanel } from '../components/AccountPanel'
import { inputStyle } from '../components/atoms'
import type { AuthUser, OAuthProvider } from '../lib/auth'
import {
  BANNERS,
  FRAMES,
  TITLES,
  bannerOf,
  frameOf,
  titleOf,
  unlockCounts,
} from '../data/cosmetics'
import {
  BACKGROUNDS,
  BODIES,
  BOTTOMS,
  BOTTOM_COLORS,
  EYEWEARS,
  EYE_COLORS,
  EYE_SHAPES,
  FACIAL_HAIRS,
  HAIRS,
  HAIR_COLORS,
  HANDHELDS,
  HEADWEARS,
  MASKS,
  SKINS,
  TOPS,
  TOP_COLORS,
  bgOf,
  type AvatarConfig,
  type Style,
  type Swatch,
} from '../lib/avatar'
import { KEYRING, calcStreak, levelInfo } from '../lib/gamification'
import { keysDate, savingsGoal } from '../lib/math'
import type { AppState, Profile as ProfileT } from '../types'

export function Profile({
  state,
  onSave,
  onBack,
  authConfigured,
  user,
  onSignIn,
  onSignOut,
}: {
  state: AppState
  onSave: (p: ProfileT) => void
  onBack: () => void
  authConfigured: boolean
  user: AuthUser | null
  onSignIn: (provider: OAuthProvider) => void
  onSignOut: () => void
}) {
  const profile = state.profile!
  const lvl = levelInfo(state.xp)
  const level = lvl.level
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ProfileT>(profile)

  const shown = editing ? draft : profile
  const name = shown.displayName.trim() || 'Future Homeowner'

  // Stats
  const goal = savingsGoal(state.plan.target, state.plan.homeType)
  const totalSaved = state.plan.startingSavings + state.contributions.reduce((a, c) => a + c.amount, 0)
  const progress = Math.min(1, totalSaved / goal)
  const baseMonthly = state.plan.monthly * (state.plan.coBuyer ? 2 : 1)
  const remaining = Math.max(0, goal - totalSaved)
  const date = remaining === 0 ? 'Today 🎉' : keysDate(baseMonthly > 0 ? remaining / baseMonthly : Infinity)
  const wardrobe = unlockCounts(level)

  const setAvatar = (patch: Partial<AvatarConfig>) => setDraft({ ...draft, avatar: { ...draft.avatar, ...patch } })

  /* ————— Calling card: head medallion in a frame over the banner ————— */
  const callingCard = (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${C.line}` }}>
      <div style={{ background: bannerOf(shown.banner).background, height: 92 }} />
      <div style={{ background: '#fff', padding: '0 18px 18px', textAlign: 'center', marginTop: -46 }}>
        <HeadMedallion avatar={shown.avatar} frame={shown.frame} size={92} />
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
          {titleOf(shown.title).label} · Lv {level}
        </div>
        {shown.bio.trim() && (
          <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, marginTop: 10 }}>{shown.bio.trim()}</div>
        )}
      </div>
    </div>
  )

  /* ————— Full-body display (background-aware) ————— */
  const stageBg =
    shown.avatar.background === 'none'
      ? `radial-gradient(120% 80% at 50% 100%, ${C.sproutSoft}, #fff)`
      : bgOf(shown.avatar.background).background
  const stage = (size: number) => (
    <div
      style={{
        borderRadius: 18,
        border: `1.5px solid ${C.line}`,
        background: stageBg,
        padding: '16px 0 4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <PixelAvatar config={shown.avatar} mode="full" size={size} />
    </div>
  )

  if (editing) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: C.paper, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ flex: '0 0 auto', width: '100%', maxWidth: 480, margin: '0 auto', padding: '8px 20px 0', boxSizing: 'border-box' }}>
          <TopBar label="Character creator" onBack={() => setEditing(false)} />
        </div>

        {/* Live preview — pinned to the top half, always in view. */}
        <div
          style={{
            flex: '1 1 50%',
            minHeight: 0,
            background: stageBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderTop: `1px solid ${C.line}`,
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <PixelAvatar config={shown.avatar} mode="full" size={150} />
        </div>

        {/* Options — scroll in the bottom half. */}
        <div style={{ flex: '1 1 50%', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: '16px 20px 20px', boxSizing: 'border-box' }}>
        <div>
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
          🎁 {wardrobe.unlocked}/{wardrobe.total} options unlocked · keep earning XP to unlock more.
        </div>

        <SectionHead>Character</SectionHead>
        <StyleRow label="Body type" items={BODIES} level={level} selected={draft.avatar.body} onPick={(id) => setAvatar({ body: id })} preview={(id) => ({ ...draft.avatar, body: id })} mode="full" />
        <SwatchRow label="Skin tone" items={SKINS} level={level} selected={draft.avatar.skin} onPick={(id) => setAvatar({ skin: id })} />
        <StyleRow label="Hair" items={HAIRS} level={level} selected={draft.avatar.hair} onPick={(id) => setAvatar({ hair: id })} preview={(id) => ({ ...draft.avatar, hair: id })} mode="head" />
        <SwatchRow label="Hair colour" items={HAIR_COLORS} level={level} selected={draft.avatar.hairColor} onPick={(id) => setAvatar({ hairColor: id })} />
        <StyleRow label="Eyes" items={EYE_SHAPES} level={level} selected={draft.avatar.eyeShape} onPick={(id) => setAvatar({ eyeShape: id })} preview={(id) => ({ ...draft.avatar, eyeShape: id })} mode="head" />
        <SwatchRow label="Eye colour" items={EYE_COLORS} level={level} selected={draft.avatar.eyeColor} onPick={(id) => setAvatar({ eyeColor: id })} />
        <StyleRow label="Facial hair" items={FACIAL_HAIRS} level={level} selected={draft.avatar.facialHair} onPick={(id) => setAvatar({ facialHair: id })} preview={(id) => ({ ...draft.avatar, facialHair: id })} mode="head" />
        <StyleRow label="Eyewear" items={EYEWEARS} level={level} selected={draft.avatar.eyewear} onPick={(id) => setAvatar({ eyewear: id })} preview={(id) => ({ ...draft.avatar, eyewear: id })} mode="head" />
        <StyleRow label="Mask" items={MASKS} level={level} selected={draft.avatar.mask} onPick={(id) => setAvatar({ mask: id })} preview={(id) => ({ ...draft.avatar, mask: id })} mode="head" />
        <StyleRow label="Headwear" items={HEADWEARS} level={level} selected={draft.avatar.headwear} onPick={(id) => setAvatar({ headwear: id })} preview={(id) => ({ ...draft.avatar, headwear: id })} mode="head" />
        <StyleRow label="Top" items={TOPS} level={level} selected={draft.avatar.top} onPick={(id) => setAvatar({ top: id })} preview={(id) => ({ ...draft.avatar, top: id })} mode="full" />
        <SwatchRow label="Top colour" items={TOP_COLORS} level={level} selected={draft.avatar.topColor} onPick={(id) => setAvatar({ topColor: id })} />
        <StyleRow label="Bottom" items={BOTTOMS} level={level} selected={draft.avatar.bottom} onPick={(id) => setAvatar({ bottom: id })} preview={(id) => ({ ...draft.avatar, bottom: id })} mode="full" />
        <SwatchRow label="Bottom colour" items={BOTTOM_COLORS} level={level} selected={draft.avatar.bottomColor} onPick={(id) => setAvatar({ bottomColor: id })} />
        <StyleRow label="In hand" items={HANDHELDS} level={level} selected={draft.avatar.handheld} onPick={(id) => setAvatar({ handheld: id })} preview={(id) => ({ ...draft.avatar, handheld: id })} mode="full" />

        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Background</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
          {BACKGROUNDS.map((it) => (
            <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={draft.avatar.background === it.id} onClick={() => setAvatar({ background: it.id })} label={it.label}>
              <div style={{ width: '100%', height: 34, borderRadius: 8, background: it.id === 'none' ? '#fff' : it.background, border: it.id === 'none' ? `1.5px dashed ${C.line}` : 'none' }} />
            </Tile>
          ))}
        </div>

        <SectionHead>Calling card</SectionHead>
        <FrameRow avatar={draft.avatar} level={level} selected={draft.frame} onPick={(id) => setDraft({ ...draft, frame: id })} />
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Banner</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
          {BANNERS.map((it) => (
            <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={draft.banner === it.id} onClick={() => setDraft({ ...draft, banner: it.id })} label={it.label}>
              <div style={{ width: '100%', height: 34, borderRadius: 8, background: it.background }} />
            </Tile>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Title</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {TITLES.map((it) => (
            <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={draft.title === it.id} onClick={() => setDraft({ ...draft, title: it.id })} label={it.label}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.ink, textAlign: 'center', lineHeight: 1.2 }}>{it.label}</span>
            </Tile>
          ))}
        </div>
          </div>
        </div>

        {/* Footer — always-visible actions. */}
        <div style={{ flex: '0 0 auto', width: '100%', maxWidth: 480, margin: '0 auto', padding: '10px 20px', boxSizing: 'border-box', borderTop: `1px solid ${C.line}`, display: 'flex', gap: 10, background: C.paper }}>
          <button type="button" onClick={() => { setDraft(profile); setEditing(false) }} style={btnGhost}>
            Cancel
          </button>
          <button type="button" onClick={() => { onSave(draft); setEditing(false) }} style={btnPrimary}>
            Save character
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopBar label="Your profile" onBack={onBack} />
      <AccountPanel configured={authConfigured} user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      {callingCard}
      <div style={{ marginTop: 14 }}>{stage(112)}</div>

      <div style={{ margin: '14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.sub, marginBottom: 6 }}>
          <span>Lv {level} {lvl.title} · {state.xp} XP</span>
          <span>{lvl.max ? 'Max level 🎉' : `${lvl.toNext} XP to Lv ${level + 1}`}</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: C.line, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.max(4, lvl.pct * 100)}%`, background: `linear-gradient(90deg, ${C.sprout}, ${C.gold})`, borderRadius: 999 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Stat label="Keys date" value={date} />
        <Stat label="Saved" value={`${Math.round(progress * 100)}%`} />
        <Stat label="Deposit streak" value={`${calcStreak(state.contributions)} mo`} />
        <Stat
          label="Keys earned"
          value={`${state.earnedBadges.filter((id) => KEYRING.some((k) => k.id === id)).length}/${KEYRING.length}`}
        />
      </div>

      <div style={{ fontSize: 12, color: C.sub, marginBottom: 16, textAlign: 'center' }}>
        🎁 {wardrobe.unlocked}/{wardrobe.total} options unlocked
      </div>

      <button type="button" onClick={() => { setDraft(profile); setEditing(true) }} style={btnPrimary}>
        🎨 Customize character
      </button>
    </>
  )
}

/* ————— Pieces ————— */

function HeadMedallion({ avatar, frame, size }: { avatar: AvatarConfig; frame: string; size: number }) {
  const f = frameOf(frame)
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        border: f.border,
        boxShadow: f.boxShadow,
        background: f.bg,
        overflow: 'hidden',
      }}
    >
      <PixelAvatar config={avatar} mode="head" size={size - 12} />
    </div>
  )
}

const btnGhost = {
  flex: 1,
  padding: '15px',
  fontSize: 15,
  fontWeight: 600,
  color: C.sub,
  background: '#fff',
  border: `1.5px solid ${C.line}`,
  borderRadius: 14,
  cursor: 'pointer',
} as const

const btnPrimary = {
  flex: 2,
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
} as const

function TopBar({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0 12px' }}>
      <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: C.sub, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 0', fontFamily: BODY_FONT }}>
        ← Back
      </button>
      <span style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 18 }}>{label}</span>
    </div>
  )
}

function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 17, margin: '6px 0 12px', color: C.spruce }}>
      {children}
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

function Tile({
  unlockLevel,
  level,
  active,
  onClick,
  label,
  children,
}: {
  unlockLevel: number
  level: number
  active: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  const locked = level < unlockLevel
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => !locked && onClick()}
      title={locked ? `Unlocks at Lv ${unlockLevel}` : label}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 4,
        borderRadius: 12,
        cursor: locked ? 'not-allowed' : 'pointer',
        background: active ? C.sproutSoft : '#fff',
        border: `1.5px solid ${active ? C.sprout : C.line}`,
        opacity: locked ? 0.55 : 1,
        overflow: 'hidden',
      }}
    >
      {children}
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
          Lv {unlockLevel}
        </span>
      )}
    </button>
  )
}

function SwatchRow({
  label,
  items,
  level,
  selected,
  onPick,
}: {
  label: string
  items: Swatch[]
  level: number
  selected: string
  onPick: (id: string) => void
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {items.map((it) => (
          <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={selected === it.id} onClick={() => onPick(it.id)} label={it.label}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: it.color, border: `1.5px solid rgba(0,0,0,0.12)` }} />
          </Tile>
        ))}
      </div>
    </div>
  )
}

function StyleRow({
  label,
  items,
  level,
  selected,
  onPick,
  preview,
  mode,
}: {
  label: string
  items: Style[]
  level: number
  selected: string
  onPick: (id: string) => void
  preview: (id: string) => AvatarConfig
  mode: 'head' | 'full'
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {items.map((it) => (
          <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={selected === it.id} onClick={() => onPick(it.id)} label={it.label}>
            <PixelAvatar config={preview(it.id)} mode={mode} size={mode === 'head' ? 40 : 30} />
            <span style={{ fontSize: 9.5, color: C.sub, fontWeight: 600, lineHeight: 1 }}>{it.label}</span>
          </Tile>
        ))}
      </div>
    </div>
  )
}

function FrameRow({
  avatar,
  level,
  selected,
  onPick,
}: {
  avatar: AvatarConfig
  level: number
  selected: string
  onPick: (id: string) => void
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Frame</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {FRAMES.map((it) => (
          <Tile key={it.id} unlockLevel={it.unlockLevel} level={level} active={selected === it.id} onClick={() => onPick(it.id)} label={it.label}>
            <HeadMedallion avatar={avatar} frame={it.id} size={44} />
          </Tile>
        ))}
      </div>
    </div>
  )
}
