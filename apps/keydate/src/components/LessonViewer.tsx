import { useState } from 'react'
import { C, BODY_FONT, DISPLAY_FONT } from '../theme'
import { bigBtn, card } from './atoms'
import type { Lesson } from '../types'

export function LessonViewer({
  lesson,
  onComplete,
  onBack,
  isDone,
}: {
  lesson: Lesson
  onComplete: (lessonId: string, bonus: number) => void
  onBack: () => void
  isDone: boolean
}) {
  const [step, setStep] = useState(0) // card index; cards.length = quiz
  const [picked, setPicked] = useState<number | null>(null)
  const atQuiz = step === lesson.cards.length
  const correct = picked === lesson.quiz.answer

  return (
    <div>
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
        ← Back to lessons
      </button>
      <div style={{ fontSize: 34, margin: '6px 0 2px' }}>{lesson.emoji}</div>
      <h2
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 26,
          fontWeight: 700,
          margin: '0 0 4px',
          lineHeight: 1.15,
        }}
      >
        {lesson.title}
      </h2>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 16 }}>
        {lesson.mins} min · {atQuiz ? 'Quick check' : `Card ${step + 1} of ${lesson.cards.length}`}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {[...lesson.cards, 'quiz'].map((_, i) => (
          <div
            key={i}
            style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? C.sprout : C.line }}
          />
        ))}
      </div>

      {!atQuiz ? (
        <>
          <div
            style={{
              ...card,
              minHeight: 140,
              fontSize: 15.5,
              lineHeight: 1.65,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {lesson.cards[step]}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.spruce,
                  background: '#fff',
                  border: `1.5px solid ${C.line}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button type="button" onClick={() => setStep(step + 1)} style={{ ...bigBtn(), flex: 2 }}>
              {step === lesson.cards.length - 1 ? 'Quick check →' : 'Next →'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ ...card }}>
            <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 12, lineHeight: 1.4 }}>
              {lesson.quiz.q}
            </div>
            {lesson.quiz.options.map((opt, i) => {
              const chosen = picked === i
              const showState = picked !== null
              const isAnswer = i === lesson.quiz.answer
              let bg: string = '#fff'
              let border: string = C.line
              if (showState && isAnswer) {
                bg = C.sproutSoft
                border = C.sprout
              } else if (showState && chosen && !isAnswer) {
                bg = '#FBEAE5'
                border = C.err
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => picked === null && setPicked(i)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: BODY_FONT,
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 12,
                    cursor: picked === null ? 'pointer' : 'default',
                    color: C.ink,
                  }}
                >
                  {opt}
                </button>
              )
            })}
            {picked !== null && (
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  marginTop: 8,
                  padding: '12px 14px',
                  background: correct ? C.sproutSoft : C.goldSoft,
                  borderRadius: 12,
                }}
              >
                <strong>{correct ? 'Exactly right. ' : 'Not quite — '}</strong>
                {lesson.quiz.why}
              </div>
            )}
          </div>
          {picked !== null && (
            <button
              type="button"
              onClick={() => onComplete(lesson.id, correct ? 25 : 0)}
              style={bigBtn(true, C.sprout)}
            >
              {isDone ? 'Done — back to lessons' : 'Complete lesson ✓'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
