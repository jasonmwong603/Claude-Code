import { useState } from 'react'
import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { bigBtn, card } from '../components/atoms'
import { fmt } from '../lib/math'
import { SANDBOX_INSTITUTIONS } from '../data/plaidSandbox'
import {
  connectSandbox,
  disconnect,
  fundTotal,
  loadItems,
  refreshBalances,
  refreshedAgo,
  toggleCountToward,
} from '../lib/plaid'
import { hasVoted, registerInterest } from '../lib/interest'
import type { PlaidItem } from '../types'

export function Bank({
  onBack,
  onSetSavings,
  onBankChange,
  userId,
}: {
  onBack: () => void
  onSetSavings: (total: number) => void
  onBankChange: () => void
  userId: string | null
}) {
  const [items, setItems] = useState<PlaidItem[]>(() => loadItems())
  const [picking, setPicking] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [wantsSync, setWantsSync] = useState(() => hasVoted('bank_sync'))

  const total = fundTotal(items)
  const lastRefreshed = items.map((i) => i.lastRefreshed).sort().pop()

  const connect = (institutionId: string) => {
    setConnecting(institutionId)
    // Simulate the Plaid Link round-trip (hosted login + token exchange).
    setTimeout(() => {
      connectSandbox(institutionId) // persists the new item
      setItems(loadItems())
      setConnecting(null)
      setPicking(false)
      onBankChange()
    }, 750)
  }

  const refresh = () => {
    setItems(refreshBalances())
    onBankChange()
  }
  const toggle = (itemId: string, accountId: string) => {
    setItems(toggleCountToward(itemId, accountId))
    onBankChange()
  }
  const remove = (itemId: string) => {
    setItems(disconnect(itemId))
    onBankChange()
  }

  return (
    <>
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
          padding: '10px 0',
          fontFamily: BODY_FONT,
        }}
      >
        ← Back
      </button>
      <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 700, margin: '4px 0 6px' }}>
        Your money
      </h1>
      <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, margin: '0 0 14px' }}>
        Connect a bank to watch your balance grow toward your keys date. <strong>View only</strong> —
        KeyDate can never move your money.
      </p>

      <div
        style={{
          fontSize: 12,
          color: C.sub,
          background: C.goldSoft,
          border: `1px solid ${C.gold}`,
          borderRadius: 12,
          padding: '10px 12px',
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        🔒 <strong>Sandbox preview.</strong> This is a simulation with sample data — no real bank and
        no login. In production this opens <strong>Plaid Link</strong> (Plaid’s secure hosted
        sign-in), and balances are read-only.
      </div>

      {/* Demand signal: we build real bank sync when enough people ask for it. */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
          🏦 Want this connected to your real bank?
        </div>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5, margin: '0 0 12px' }}>
          Real, read-only balance sync — your deposits logged automatically, no manual entry. It’s
          the next big build, and we’re prioritizing it by how many people actually want it.
        </p>
        {wantsSync ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.spruce,
              background: C.sproutSoft,
              border: `1.5px solid ${C.sprout}`,
              borderRadius: 12,
              padding: '11px 14px',
              textAlign: 'center',
            }}
          >
            ✓ Counted — we’ll email you the moment it’s live.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setWantsSync(true)
              void registerInterest('bank_sync', userId)
            }}
            style={{ ...bigBtn(true, C.spruce), fontSize: 14, padding: '12px 16px' }}
          >
            👋 Yes — notify me when bank sync is ready
          </button>
        )}
      </div>

      {/* Total counting toward the fund */}
      {items.length > 0 && (
        <div style={{ background: C.spruce, color: '#fff', borderRadius: 18, padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            Counting toward your home fund
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 34, fontWeight: 800, marginTop: 4 }}>{fmt(total)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={refresh}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: C.spruce,
                background: '#fff',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              ↻ Refresh
            </button>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              {lastRefreshed ? `Updated ${refreshedAgo(lastRefreshed)}` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onSetSavings(Math.round(total))
              setSaved(true)
              setTimeout(() => setSaved(false), 2500)
            }}
            style={{
              marginTop: 14,
              width: '100%',
              padding: '11px',
              fontSize: 13.5,
              fontWeight: 700,
              color: C.spruce,
              background: C.gold,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            {saved ? '✓ Saved so far updated' : "Use this as my ‘Saved so far’ →"}
          </button>
        </div>
      )}

      {/* Linked institutions */}
      {items.map((item) => (
        <div key={item.item_id} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{item.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{item.institution_name}</span>
            <button
              type="button"
              onClick={() => remove(item.item_id)}
              style={{ background: 'none', border: 'none', color: C.sub, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
            >
              Disconnect
            </button>
          </div>
          {item.accounts.map((a) => (
            <label
              key={a.account_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderTop: `1px solid ${C.line}`,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={!!a.countTowardGoal}
                onChange={() => toggle(item.item_id, a.account_id)}
                style={{ width: 18, height: 18, accentColor: C.sprout, flexShrink: 0 }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                <span style={{ fontSize: 12, color: C.sub, textTransform: 'capitalize' }}>
                  {a.subtype} ••{a.mask}
                </span>
              </span>
              <span style={{ fontWeight: 700, fontSize: 14.5, color: a.countTowardGoal ? C.spruce : C.sub }}>
                {fmt(a.balances.current)}
              </span>
            </label>
          ))}
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 8, lineHeight: 1.4 }}>
            Tick the accounts whose balance should count toward your home fund.
          </div>
        </div>
      ))}

      {/* Connect flow */}
      {!picking ? (
        <button type="button" onClick={() => setPicking(true)} style={bigBtn(true, C.sprout)}>
          🔗 {items.length ? 'Connect another bank' : 'Connect a bank (view only)'}
        </button>
      ) : (
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Choose your bank</div>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>
            Sample sandbox institutions. Tap one to simulate connecting.
          </div>
          {SANDBOX_INSTITUTIONS.map((inst) => (
            <button
              key={inst.id}
              type="button"
              disabled={connecting !== null}
              onClick={() => connect(inst.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                textAlign: 'left',
                padding: '13px 14px',
                marginBottom: 8,
                background: '#fff',
                border: `1.5px solid ${C.line}`,
                borderRadius: 12,
                cursor: connecting ? 'wait' : 'pointer',
                fontFamily: BODY_FONT,
              }}
            >
              <span style={{ fontSize: 22 }}>{inst.emoji}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.ink }}>{inst.name}</span>
              <span style={{ fontSize: 12.5, color: C.sub }}>
                {connecting === inst.id ? 'Connecting…' : 'Connect →'}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPicking(false)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 14,
              fontWeight: 600,
              color: C.sub,
              background: '#fff',
              border: `1.5px solid ${C.line}`,
              borderRadius: 12,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.55, marginTop: 14 }}>
        In production, bank data would be read through Plaid over an encrypted connection, with your
        explicit consent, and used only to show balances — never to move money. You could disconnect
        any time.
      </p>
    </>
  )
}
