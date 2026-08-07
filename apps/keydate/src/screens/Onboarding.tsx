import { C, DISPLAY_FONT } from '../theme'
import { PlanForm, type PlanFormValues } from '../components/PlanForm'

export type OnboardingResult = PlanFormValues

export function Onboarding({ onSubmit }: { onSubmit: (r: OnboardingResult) => void }) {
  return (
    <>
      <h1
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.12,
          margin: '18px 0 8px',
        }}
      >
        Owning a home isn’t impossible.
        <br />
        <span style={{ color: C.sprout }}>It has a date.</span>
      </h1>
      <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.55, margin: '0 0 28px' }}>
        Answer a few things and we’ll build your plan.
      </p>

      <PlanForm
        initial={{
          locationText: '',
          resolved: null,
          homeType: 'apartment',
          // Blank, not pre-filled. A stray default is easy to submit by accident,
          // and '' (unanswered) is deliberately distinct from a typed 0.
          income: '',
          savings: '',
          monthly: '',
          targetSource: 'area',
          customPrice: '',
          targetLabel: '',
          listingUrl: '',
        }}
        submitLabel="Build my plan →"
        onSubmit={onSubmit}
      />
    </>
  )
}
