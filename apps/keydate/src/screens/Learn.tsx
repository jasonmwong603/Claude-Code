import { C, DISPLAY_FONT, BODY_FONT } from '../theme'
import { SavingsPlanBuilder } from '../components/SavingsPlanBuilder'
import { LessonViewer } from '../components/LessonViewer'
import { LESSONS, STAGES } from '../data/curriculum'
import { savingsGoal } from '../lib/math'
import type { AppState } from '../types'

export function Learn({
  state,
  activeLesson,
  onOpenLesson,
  onCloseLesson,
  onComplete,
}: {
  state: AppState
  activeLesson: string | null
  onOpenLesson: (id: string) => void
  onCloseLesson: () => void
  onComplete: (lessonId: string, bonus: number) => void
}) {
  const goal = savingsGoal(state.plan.target, state.plan.homeType)
  const totalSaved =
    state.plan.startingSavings + state.contributions.reduce((a, c) => a + c.amount, 0)
  const progress = Math.min(1, totalSaved / goal)

  if (activeLesson) {
    const lesson = LESSONS.find((l) => l.id === activeLesson)
    if (lesson) {
      return (
        <LessonViewer
          lesson={lesson}
          isDone={state.completedLessons.includes(activeLesson)}
          onComplete={onComplete}
          onBack={onCloseLesson}
        />
      )
    }
  }

  return (
    <>
      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, margin: '16px 0 4px' }}>
        Learn the journey
      </h2>
      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5, margin: '0 0 16px' }}>
        {state.completedLessons.length} of {LESSONS.length} lessons done. New stages unlock as your
        savings grow — the curriculum keeps pace with you.
      </p>

      <SavingsPlanBuilder monthly={state.plan.monthly} />

      {STAGES.map((stage) => {
        const unlocked = progress >= stage.unlockAt
        const stageLessons = LESSONS.filter((l) => l.stage === stage.id)
        const doneCount = stageLessons.filter((l) => state.completedLessons.includes(l.id)).length
        return (
          <div key={stage.id} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 15, fontFamily: DISPLAY_FONT }}>
                {unlocked ? '🔓' : '🔒'} {stage.label}
              </div>
              <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>
                {unlocked
                  ? `${doneCount}/${stageLessons.length} done`
                  : `Unlocks at ${Math.round(stage.unlockAt * 100)}% saved`}
              </div>
            </div>
            {stageLessons.map((l) => {
              const done = state.completedLessons.includes(l.id)
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && onOpenLesson(l.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    padding: '13px 14px',
                    marginBottom: 8,
                    background: done ? C.sproutSoft : '#fff',
                    border: `1.5px solid ${done ? C.sprout : C.line}`,
                    borderRadius: 14,
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.45,
                    fontFamily: BODY_FONT,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{l.emoji}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: C.ink }}>
                      {l.title}
                    </span>
                    <span style={{ fontSize: 11.5, color: C.sub }}>
                      {l.mins} min{done ? ' · completed ✓' : ''}
                    </span>
                  </span>
                  <span style={{ color: C.sub }}>{done ? '✅' : '›'}</span>
                </button>
              )
            })}
          </div>
        )
      })}
      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.55 }}>
        Educational content only — not financial, legal, or tax advice. Rules shown (FHSA, HBP,
        stress test, down payment tiers) reflect current federal programs and can change.
      </p>
    </>
  )
}
